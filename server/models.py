from flask_sqlalchemy import SQLAlchemy
from sqlalchemy_serializer import SerializerMixin
from sqlalchemy.orm import validates

db=SQLAlchemy()

class Worker(db.Model, SerializerMixin):
    __tablename__= 'workers'

    id = db.Column(db.Integer, primary_key=True)

    first_name = db.Column(db.String)
    last_name = db.Column(db.String)
    phone = db.Column(db.String)
    email = db.Column(db.String)
    location = db.Column(db.String)
    title = db.Column(db.String)
    password = db.Column(db.String)
    about = db.Column(db.String)
    image = db.Column(db.String)

    offered_jobs = db.relationship('OfferedJob', secondary='worker_offered_job_association', back_populates='workers')
    approved_jobs = db.relationship('ApprovedJob', backref='worker', lazy=True)
    bids = db.relationship('Bid', backref='worker', lazy=True)

    @validates('email')
    def validate_email(self, key, address):
        if '@' not in address:
            raise ValueError("Not a valid email Address!")
        return address
    
    @validates('phone')
    def validate_phone(self, key, number):
        if not str(number).isdigit():
            raise ValueError("Phone number should only contain digits!")
        if len(str(number)) != 10:
            raise ValueError("Phone number should be 10 digits!")
        return number


    def get_details(self):
        # Return full names and average rating of completed jobs
        completed_jobs = [
            {
                'id': job.id,
                'title': job.offered_job.title,
                'paid': job.completed_job.paid,
                'rating': job.completed_job.rating,
                'certificate': job.completed_job.certificate,
                'amount': job.amount,
            }
            for job in self.approved_jobs
            if job.completed_job
        ]

        avg_rating = (
            sum(job.completed_job.rating for job in self.approved_jobs if job.completed_job)
            / len(completed_jobs)
            if completed_jobs
            else 0
        )

        total_approved_amount = sum(job.amount for job in self.approved_jobs) if self.approved_jobs else 0

        approved_jobs = [
            {
                'id': job.id,
                'title': job.offered_job.title,
                'amount': job.amount,
                'hours': job.hours,
                'progress': job.progress,
            }
            for job in self.approved_jobs
        ]

        not_approved_or_bidded_jobs = OfferedJob.query.filter(
            ~OfferedJob.id.in_(
                db.session.query(ApprovedJob.offered_job_id)
            ),
            ~OfferedJob.id.in_(
                db.session.query(Bid.offered_job_id).filter(Bid.worker_id == self.id)
        )
        ).all()

        not_approved_or_bidded_jobs_data = [
            {
                'id': job.id,
                'title': job.title,
                'wage': job.wage,
                'hours': job.hours,
            }
            for job in not_approved_or_bidded_jobs
        ]



        bids = [
            {
                'id': bid.id,
                'amount': bid.amount,
                'offered_job_title': bid.offered_job.title,
                'offered_job_hours': bid.offered_job.hours,
                'offered_job_wage': bid.offered_job.wage,
            }
            for bid in self.bids
        ]

        active_bids = [
            {
                'id': bid.id,
                'amount': bid.amount,
                'offered_job_title': bid.offered_job.title,
                'offered_job_hours': bid.offered_job.hours,
                'offered_job_wage': bid.offered_job.wage,
            }
            for bid in self.bids
            if not bid.offered_job.approved_job
        ]

        return {
            'full_name': f"{self.first_name} {self.last_name}",
            'completed_jobs_average_rating': avg_rating,
            'approved_jobs_total_amount' : "${:,.2f}".format(total_approved_amount ),
            'completed_jobs' : completed_jobs,
            'approved_jobs': approved_jobs,
            'new_jobs' : not_approved_or_bidded_jobs_data,
            'bids': bids,
            'active_bids': active_bids,
        }

    def __repr__(self):
        return f'<Worker {self.id}, {self.first_name}, {self.last_name}, {self.phone}, {self.email}, {self.location}, {self.title}, {self.image} ,{self.about}, {self.password}>'
    
    def to_dict(self):
        return {
            'id': self.id,
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'title': self.title,
            'location': self.location,
            'email': self.email,
            'about': self.about,
            'image': self.image,    
        }



class CompletedJob(db.Model, SerializerMixin):
    __tablename__ = 'completed_jobs'
    id = db.Column(db.Integer, primary_key=True)
    paid = db.Column(db.Boolean)
    rating = db.Column(db.Integer)
    certificate = db.Column(db.Integer)

    approved_job_id = db.Column(db.Integer, db.ForeignKey('approved_jobs.id'),unique=True, nullable=False) 
    approved_job = db.relationship('ApprovedJob', back_populates='completed_job', uselist=False, single_parent=True)

    def __repr__(self):
        return f'<Completed job {self.id}, {self.paid}, {self.rating}, {self.certificate}, >'
    
    def to_dict(self):
        return {
            'id': self.id,
            'paid': self.paid,
            'rating': self.rating,
            'certicate': self.certificate,
            'approved_job_id': self.approved_job.id,
        }


class ApprovedJob(db.Model, SerializerMixin):
    __tablename__ = 'approved_jobs'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Integer)
    hours = db.Column(db.Integer)
    progress = db.Column(db.Integer)

    worker_id = db.Column(db.Integer, db.ForeignKey('workers.id'), nullable=False)
    offered_job_id = db.Column(db.Integer, db.ForeignKey('offered_jobs.id'),unique=True, nullable=False)

    offered_job = db.relationship('OfferedJob', back_populates='approved_job', uselist=False)
    completed_job = db.relationship('CompletedJob', back_populates='approved_job', uselist=False, single_parent=True)

    def __repr__(self):
        return f'<Approved job {self.id}, {self.amount}, {self.hours}, {self.progress} >'
    
    def to_dict(self):
        return {
            "id": self.id,
            "offered_job_title": self.offered_job.title,
            "amount": self.amount,
            "progress": self.progress,
            "hours": self.hours,
            
        }

class Bid(db.Model, SerializerMixin):
    __tablename__ = 'bids'
    id = db.Column(db.Integer, primary_key=True)
    amount = db.Column(db.Float)

    worker_id = db.Column(db.Integer, db.ForeignKey('workers.id'), nullable=False)
    offered_job_id = db.Column(db.Integer, db.ForeignKey('offered_jobs.id'), nullable=False)

    def __repr__(self):
        return f'<Bid {self.id}, {self.amount} >'

class OfferedJob(db.Model, SerializerMixin):
    __tablename__ = 'offered_jobs'
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255))
    wage = db.Column(db.Float)
    hours = db.Column(db.Integer)

    workers = db.relationship('Worker', secondary='worker_offered_job_association', back_populates='offered_jobs')
    approved_job = db.relationship('ApprovedJob', back_populates='offered_job', uselist=False, single_parent=True)
    bids = db.relationship('Bid', backref='offered_job', lazy=True)

    def __repr__(self):
        return f'<Offered job {self.id}, {self.title}, {self.wage}, {self.hours} >'
    
# Association table for the many-to-many relationship between Worker and OfferedJob
worker_offered_job_association = db.Table(
    'worker_offered_job_association',
    db.Column('worker_id', db.Integer, db.ForeignKey('workers.id')),
    db.Column('offered_job_id', db.Integer, db.ForeignKey('offered_jobs.id'))
)

