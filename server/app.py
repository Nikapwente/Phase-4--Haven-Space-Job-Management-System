from flask import Flask, jsonify, request, make_response, session
from flask_migrate import Migrate
from flask_restful import Api, Resource
from models import db, Worker, OfferedJob, CompletedJob, ApprovedJob, Bid
from flask_bcrypt import Bcrypt
import os
from flask_cors import CORS


#Create an Instance
app = Flask(__name__)
api = Api(app)
bcrypt = Bcrypt(app)
CORS(app)
secret_key = os.urandom(24)
app.secret_key = secret_key

app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///haven.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.json.compact = False

#Create Migrations
migrate = Migrate(app, db)

db.init_app(app)

class Index(Resource):
    def get(self):
        return "<h1>Skidi Papa Papa</h1>"

class RegisterWorker(Resource):
    pass



class AllWorkers(Resource):
    def post(self):
        # data = request.get_json()
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
        return make_response(jsonify({"Message": f"New user with email, {new_worker.email}, successfully registered."}), 409)


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
            "completed_jobs_average_rating": worker.get_details()['completed_jobs_average_rating'],
            "approved_jobs_total_amount": worker.get_details()['approved_jobs_total_amount'],
            "completed_jobs": worker.get_details()['completed_jobs'],
            "approved_jobs": worker.get_details()['approved_jobs'],
            "bids": worker.get_details()['bids'],
        }
        return make_response(jsonify(worker_data))

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
            "completed_jobs_average_rating": worker.get_details()['completed_jobs_average_rating'],
            "approved_jobs_total_amount": worker.get_details()['approved_jobs_total_amount'],
            "completed_jobs": worker.get_details()['completed_jobs'],
            "approved_jobs": worker.get_details()['approved_jobs'],
            "bids": worker.get_details()['bids'],
            "new_jobs": worker.get_details()['new_jobs'],
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
                'id': offered_job.id,
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
            }
            for bid in bids_list
        ]
        return make_response(jsonify(bids_list))
    
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





api.add_resource(Index, '/')
api.add_resource(AllWorkers, '/workers')
api.add_resource(WorkerById, '/workers/<int:id>')
api.add_resource(OfferedJobs, '/offered_jobs')
api.add_resource(ApprovedJobs, '/approved_jobs')
api.add_resource(CompletedJobs, '/completed_jobs')
api.add_resource(Bids, '/bids')
api.add_resource(LoginUser, '/login')



if __name__ == '__main__':
    app.run(port=5555)