from flask import Flask, jsonify, flash, request, make_response, session
from flask_migrate import Migrate
from flask_restful import Api, Resource
from models import db, Worker, OfferedJob, CompletedJob, ApprovedJob, Bid
from flask_bcrypt import Bcrypt
import os
from flask_cors import CORS
from werkzeug.utils import secure_filename
from faker import Faker

# UPLOAD_FOLDER = "assets/images/"
UPLOAD_FOLDER = "../client/public/images/"

#Create an Instance
app = Flask(__name__)
api = Api(app)
bcrypt = Bcrypt(app)
CORS(app)
secret_key = os.urandom(24)
app.secret_key = secret_key
fake=Faker()

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///haven.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.json.compact = False

ALLOWED_EXTENSIONS = set(['png','jpg','jpeg','gif'])

#Create Migrations
migrate = Migrate(app, db)

db.init_app(app)

def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

class Index(Resource):
    def get(self):
        return "<h1>Skidi Papa Papa</h1>"

class RegisterWorker(Resource):
    pass



class AllWorkers(Resource):
    def post(self):
        
        # Get form data
        email = request.form.get('email')

        # Check if user with the given email already exists
        existing_worker = Worker.query.filter(Worker.email == email).first()
        if existing_worker:
            return make_response(jsonify({"Error": f"Email account {email} already exists"}), 409)

        # If the email is unique, proceed with creating the new user
        new_worker = Worker(first_name=request.form.get('first_name'),
                          last_name=request.form.get('last_name'),
                          phone=request.form.get('phone'),
                          title=request.form.get('title'),
                          email=request.form.get('email'),
                          location=request.form.get('location'),
                          password=bcrypt.generate_password_hash(request.form.get('password')),
                          )
        
        worker = Worker.query.filter(Worker.email == new_worker.email).first()
        if worker is not None:
            return make_response(jsonify({"Error": f"Email account {new_worker.email} already exists"}), 409)
        
        db.session.add(new_worker)
        db.session.commit()

        #Create a session for the worker
        session["worker_id"] = new_worker.id

        # return make_response(jsonify(new_worker.to_dict()), 201)
        return make_response(jsonify({"Message": f"New user with email, {new_worker.email}, successfully registered."}), 201)


    def get(self):
        workers = Worker.query.all()
        workers_list = [
            {
            "id": worker.id,
            "first_name": worker.first_name,
            "last_name": worker.last_name,
            "email": worker.email,
            "title": worker.title,
            "completed_jobs_average_rating": worker.get_details()['completed_jobs_average_rating'],
            "approved_jobs_total_amount": worker.get_details()['approved_jobs_total_amount'],
            "completed_jobs": worker.get_details()['completed_jobs'],
            "approved_jobs": worker.get_details()['approved_jobs'],
            "bids": worker.get_details()['bids'],
            
        }
            for worker in workers
        ]
        return make_response(jsonify(workers_list))

class WorkerById(Resource):
    def get(self, id):
        worker = Worker.query.get(id)

        if worker is None:
            return make_response(jsonify({"error": "Worker not found"}), 404)

        worker_data = {
            "id": worker.id,
            "first_name": worker.first_name,
            "last_name": worker.last_name,
            "email": worker.email,
            "title": worker.title,
            "phone": worker.phone,
            "image": worker.image,
            "about": worker.about,
            "location": worker.location,
            "completed_jobs_average_rating": worker.get_details()['completed_jobs_average_rating'],
            "approved_jobs_total_amount": worker.get_details()['approved_jobs_total_amount'],
            "completed_jobs": worker.get_details()['completed_jobs'],
            "approved_jobs": worker.get_details()['approved_jobs'],
            "bids": worker.get_details()['bids'],
            "new_jobs": worker.get_details()['new_jobs'],
            "active_bids": worker.get_details()['active_bids'],
        }
        return make_response(jsonify(worker_data))
    
    def patch(self, id):
        data = request.get_json()
        
        worker = Worker.query.get(id)

        if worker is None:
            return make_response(jsonify({"error": "Worker not found"}), 404)

        if 'about' in data:
            worker.about = data['about']
        if 'location' in data:
            worker.location = data['location']
        if 'phone' in data:
            worker.phone = data['phone']


        

        db.session.add(worker)
        db.session.commit()

        updated_worker_data = {
            "id": worker.id,
            "first_name": worker.first_name,
            "last_name": worker.last_name,
            "email": worker.email,
            "title": worker.title,
            "phone": worker.phone,
            "image": worker.image,
            "about": worker.about,
            "location": worker.location,
            "completed_jobs_average_rating": worker.get_details()['completed_jobs_average_rating'],
            "approved_jobs_total_amount": worker.get_details()['approved_jobs_total_amount'],
            "completed_jobs": worker.get_details()['completed_jobs'],
            "approved_jobs": worker.get_details()['approved_jobs'],
            "bids": worker.get_details()['bids'],
            "new_jobs": worker.get_details()['new_jobs'],
            "active_bids": worker.get_details()['active_bids'],
        }
        return make_response(jsonify(updated_worker_data), 200)

    def post(self, id):
        # Handle image upload
        worker = Worker.query.get(id)
        image_file = request.files['image']

        if 'image' not in request.files:
            flash('No file...')
            return make_response(jsonify({"error": "Worker not found"}), 404)

        if image_file.filename == '':
            flash('No image selected')
            return make_response(jsonify({"error": "No file selected"}), 404)

        if image_file and allowed_file(image_file.filename):
            filename = secure_filename(image_file.filename)
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            image_file.save(image_path)
            worker.image = image_path

            updated_worker = {"image": worker.image}

            
            db.session.commit()

        return make_response(jsonify(updated_worker), 200)




class LoginUser(Resource):
    def post(self):
        email = request.form.get('email')
        password = request.form.get('password')
        worker = Worker.query.filter(Worker.email == email).first()

        if worker is None:
            return make_response(jsonify({"Error": "No such user!"}), 401)
        if not bcrypt.check_password_hash(worker.password, password):
            return make_response(jsonify({"Error": "Incorrect password!"}), 401)
        
        #Create a session for the worker
        session["worker_id"] = worker.id
        return make_response(jsonify({
            "Message": "Login successful!",
            "name": f"{worker.first_name} {worker.last_name}",
            "id": f"{worker.id}",
            "email": worker.email,
            "title": worker.title,
            "image": worker.image,
            "completed_jobs_average_rating": worker.get_details()['completed_jobs_average_rating'],
            "approved_jobs_total_amount": worker.get_details()['approved_jobs_total_amount'],
            "completed_jobs": worker.get_details()['completed_jobs'],
            "approved_jobs": worker.get_details()['approved_jobs'],
            "bids": worker.get_details()['bids'],
            "new_jobs": worker.get_details()['new_jobs'],
             "active_bids": worker.get_details()['active_bids'],           
            }), 200)
        
    def delete(self):
        session.pop("worker_id", None)
        return make_response(jsonify({"Message": "Logout successful!"}), 200)



class OfferedJobs(Resource):
    def get(self):
        offered_jobs = OfferedJob.query.all()
        offered_jobs_list = [
            {
                "id": job.id,
                "title": job.title,
                "wage": job.wage,
                "hours": job.hours,
            }
            for job in offered_jobs
        ]
        return make_response(jsonify(offered_jobs_list))

    def post(self):
        data = request.get_json()
        offered_job = OfferedJob(title=data.get('title'), wage=data.get('wage'), hours=data.get('hours'))
        db.session.add(offered_job)
        db.session.commit()
        return make_response(
            jsonify({
                'title': offered_job.title,
                'wage': offered_job.wage,
                'hours': offered_job.hours
            })
        )

class ApprovedJobs(Resource):
    def get(self):
        approved_jobs = ApprovedJob.query.all()
        approved_jobs_list = [
            {
                "id": job.id,
                "offered_job_title": job.offered_job.title,
                "amount": job.amount,
                "progress": job.progress,
                "hours": job.hours,
            }
            for job in approved_jobs
        ]
        return make_response(jsonify(approved_jobs_list))
    
    def post(self):
        pass
        data = request.get_json()

        new_approved_job = ApprovedJob(
            amount = data['amount'],
            worker_id = data['worker_id'],
            offered_job_id = data['offered_job_id'],
            hours = data['hours'],
            progress = data['progress']
        )

        db.session.add(new_approved_job)
        db.session.commit()

        return make_response(new_approved_job.to_dict(), 201)

class ApprovedJobById(Resource):
    def get(self, id):
        approved_job = ApprovedJob.query.get(id)

        if approved_job is None:
            return make_response(jsonify({"error": "Approved job not found"}), 404)

        approved_job_data = {
            "id": approved_job.id,
            "title": approved_job.offered_job.title,
            "amount": approved_job.offered_job.hours,
            "progress": approved_job.progress,
            "hours": approved_job.hours,
        }
        return make_response(jsonify(approved_job_data))

    def put(self, id):
        data = request.get_json()
        if 'progress' not in data:
            return make_response(jsonify({"error": "Progress not provided"}), 400)

        approved_job = ApprovedJob.query.get(id)
        if approved_job is None:
            return make_response(jsonify({"error": "Approved job not found"}), 404)

        try:
            new_progress = int(data['progress'])
            if new_progress < 0 or new_progress > 100:
                return make_response(jsonify({"error": "Progress must be between 0 and 100"}), 400)
            approved_job.progress = new_progress
            db.session.commit()
            return make_response(jsonify({"message": "Progress updated successfully"}), 200)
        except ValueError:
            return make_response(jsonify({"error": "Invalid progress value"}), 400)



class Bids(Resource):
    def get(self):
        bids_list = Bid.query.all()
        bids_list = [
            {
                "id": bid.id,
                "amount": bid.amount,
                "worker_id": bid.worker.id,
                "worker_name": f"{bid.worker.first_name} {bid.worker.last_name}",
                "offered_job_title": bid.offered_job.title,
                "worker_avg_rating": bid.worker.get_details()['completed_jobs_average_rating'] 
            }
            for bid in bids_list
        ]
        return make_response(jsonify(bids_list))


class UnapprovedBids(Resource):
    def get(self):
        unapproved_bids = Bid.query.join(Bid.offered_job).filter(~OfferedJob.approved_job.has()).all()

        unapproved_bids_list = [
            {
                "id": bid.id,
                "amount": bid.amount,
                "worker_id": bid.worker.id,
                "worker_name": f"{bid.worker.first_name} {bid.worker.last_name}",
                "offered_job_title": bid.offered_job.title,
                "offered_amount": bid.offered_job.wage,
                "worker_avg_rating": bid.worker.get_details()['completed_jobs_average_rating'],
                "offered_job_id":bid.offered_job_id,
                "hours":bid.offered_job.hours,
            }
            for bid in unapproved_bids
        ]
        return make_response(jsonify(unapproved_bids_list))
    
class ConcludedJobs(Resource):
    def get(self):
        concluded_jobs = ApprovedJob.query.filter(~ApprovedJob.completed_job.has(), ApprovedJob.progress == 100).all()


        concluded_jobs_list = [
            {
                "id" : job.id,
                "title" : job.offered_job.title,
                "amount" : job.amount,
                "hours" : job.offered_job.hours,
                "contractor" : f"{job.worker.first_name} {job.worker.last_name}",
            }
            for job in concluded_jobs
        ]
        return make_response(jsonify(concluded_jobs_list))

    
class BidById(Resource):
    def get(self, id):
        bid = Bid.query.get(id)

        if bid is None:
            return make_response(jsonify({"error": "Bid not found"}), 404)

        bid_data = {
            "id": bid.id,
                "amount": bid.amount,
                "worker_id": bid.worker.id,
                "worker_name": f"{bid.worker.first_name} {bid.worker.last_name}",
                "offered_job_title": bid.offered_job.title,
                "worker_avg_rating": bid.worker.get_details()['completed_jobs_average_rating'] 
        }
        return make_response(jsonify(bid_data))
    
    def post(self, id):
        data = request.get_json()
        amount = data.get('amount')
        worker_id = data.get('worker_id')
        offered_job_id = data.get('offered_job_id')
        
        new_bid = Bid(amount=amount, worker_id=worker_id, offered_job_id=offered_job_id)

        db.session.add(new_bid)
        db.session.commit()

        return make_response(jsonify({"message": "Bid placed successfully!"}), 201)
    
    def delete(self, id): 
        bid = Bid.query.get(id)
        if bid is None:
            return {'error': 'Bid not found'}, 404

        db.session.delete(bid)
        db.session.commit()

        return {}, 204




class CompletedJobs(Resource):
    def get(self):
        completed_jobs = CompletedJob.query.all()
        completed_jobs_list = [
            {
                "id": job.id,
                "paid": job.paid,
                "rating": job.rating,
                "certificate": job.certificate,
                "worker_name": job.approved_job.worker.get_details()['full_name'] if job.approved_job.worker else None,
            }
            for job in completed_jobs
        ]
        return make_response(jsonify(completed_jobs_list))
    
    def post(self):
        pass
        data = request.get_json()

        new_completed_job = CompletedJob(
            approved_job_id = data['approved_job_id'],
            rating = data['rating'],
            certificate = fake.random_int(100000, 999999),
            paid = data['paid']
            
        )

        db.session.add(new_completed_job)
        db.session.commit()

        return make_response(new_completed_job.to_dict(), 201)





api.add_resource(Index, '/')
api.add_resource(AllWorkers, '/workers')
api.add_resource(WorkerById, '/workers/<int:id>')
api.add_resource(OfferedJobs, '/offered_jobs')
api.add_resource(ApprovedJobs, '/approved_jobs')
api.add_resource(ApprovedJobById, '/approved_jobs/<int:id>')
api.add_resource(CompletedJobs, '/completed_jobs')
api.add_resource(ConcludedJobs, '/concluded_jobs')
api.add_resource(Bids, '/bids')
api.add_resource(UnapprovedBids, '/unapproved_bids')
api.add_resource(BidById, '/bids/<int:id>')
api.add_resource(LoginUser, '/login')



if __name__ == '__main__':
    app.run(port=5555)