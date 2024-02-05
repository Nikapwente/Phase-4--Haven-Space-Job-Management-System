from app import app
from models import db, Worker, Bid, OfferedJob, CompletedJob, ApprovedJob
from faker import Faker
from flask_bcrypt import Bcrypt
from app import secret_key

fake=Faker()
bcrypt = Bcrypt(app)
app.secret_key = secret_key

def seed_workers(num_workers, max_finance_managers=2, max_personnel_managers=2):
    finance_managers = 0
    personnel_managers = 0
    workers = []

    for _ in range(num_workers):
        title = fake.random_element(elements=('finance manager', 'personnel manager', 'contractor'))

        # Check and limit the number of finance managers and personnel managers
        if title == 'finance manager' and finance_managers < max_finance_managers:
            finance_managers += 1
        elif title == 'personnel manager' and personnel_managers < max_personnel_managers:
            personnel_managers += 1
        else:
            title = 'contractor'

        worker = Worker(
            first_name=fake.first_name(),
            last_name=fake.last_name(),
            phone=f"072{fake.random_int(1000000, 9999999)}",
            email=fake.email(),
            location=fake.city(),
            title=title,
            password=bcrypt.generate_password_hash('1234'),
            about=fake.paragraph(),
        )
        workers.append(worker)

    db.session.add_all(workers)
    db.session.commit()

def seed_offered_jobs(num_jobs):
    jobs = []
    for _ in range(num_jobs):
        job = OfferedJob(
            title=fake.job(),
            wage=fake.random_int(15, 1000),
            hours=fake.random_int(1, 1200),
        )
        jobs.append(job)
    db.session.add_all(jobs)
    db.session.commit()

def seed_bids(num_bids, workers_id, jobs_id):
    bids = []
    for _ in range(num_bids):
        bid = Bid(
            amount=fake.random_int(15, 1000),
            worker_id=fake.random_element(workers_id),
            offered_job_id=fake.random_element(jobs_id),
        )
        bids.append(bid)
    db.session.add_all(bids)
    db.session.commit()

def seed_approved_jobs(num_jobs, workers_id, jobs_id):
    approved_jobs = []

    # Keep track of selected offered_job_id values
    selected_offered_job_ids = set()

    for _ in range(num_jobs):
        # Ensure a unique offered_job_id is selected
        unique_offered_job_id = None
        while unique_offered_job_id is None or unique_offered_job_id in selected_offered_job_ids:
            unique_offered_job_id = fake.random_element(jobs_id)

        approved_job = ApprovedJob(
            amount=fake.random_int(15, 1000),
            hours=fake.random_int(1, 1200),
            progress=fake.random_int(0, 100),
            worker_id=fake.random_element(workers_id),
            offered_job_id=unique_offered_job_id,
        )

        # Add the selected offered_job_id to the set
        selected_offered_job_ids.add(unique_offered_job_id)

        approved_jobs.append(approved_job)

    db.session.add_all(approved_jobs)
    db.session.commit()

def seed_completed_jobs(num_jobs, approved_jobs_id):
    jobs = []

    # Ensure there are elements in the approved_jobs_id list
    if not approved_jobs_id:
        print("No approved jobs to link CompletedJobs to.")
        return

    # Keep track of selected approved_job_id values
    selected_approved_job_ids = set()

    for _ in range(num_jobs):
        # Ensure a unique approved_job_id is selected
        unique_approved_job_id = None
        while unique_approved_job_id is None or unique_approved_job_id in selected_approved_job_ids:
            unique_approved_job_id = fake.random_element(approved_jobs_id)

        job = CompletedJob(
            paid=fake.random_element(elements=(True, False)),
            rating=fake.random_int(1, 10),
            certificate=fake.random_int(100000, 999999),

            # Use the unique_approved_job_id
            approved_job_id=unique_approved_job_id,
        )

        # Add the selected approved_job_id to the set
        selected_approved_job_ids.add(unique_approved_job_id)

        jobs.append(job)

    db.session.add_all(jobs)
    db.session.commit()


with app.app_context():
    #Seed in Stages:
    # Phase1:
    # seed_workers(num_workers=10)
    # seed_offered_jobs(num_jobs=100)

    # Phase2:
    # workers_id = [worker.id for worker in Worker.query.all()]
    # jobs_id = [job.id for job in OfferedJob.query.all()]
    # seed_bids(80, workers_id, jobs_id)
    # seed_approved_jobs(60, workers_id, jobs_id)

    # Phase3:
    # approved_jobs_id = [approved_job.id for approved_job in ApprovedJob.query.all()]
    # seed_completed_jobs(40, approved_jobs_id)

    print("Seeding complete!")