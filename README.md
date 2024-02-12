npm install && npm start
All passwords Set to 1234

Sample Users:
Contractor: 
Email: wwoods@example.net
password: 1234

Personnel Manager: 
Email: penaldo@tapin.com
password: 1234

Haven Spaces Jobs Management System Allows Contractors to :

1. Sign Up
2. View Available jobs and place a bid
3. Update progress of their Approved Jobs (Bids are approved by the personnel manager)
4. View their completed jobs ans all their bids
4. Delete any bids that are yet be Approved
5. Update their profile details and also upload a profile picture.


Personnel Managers are allow to:
1. Post a new Job
2. Views a list of bids, the bid quality and Approve a specific bid
3. View concluded jobs (progress=100%), assign them a rating and mark them as complete.


5 models: ‘Worker’, ‘Offered_job’, ‘Approved_job’, ‘Bid’ and ‘Completed_job.

A ‘Worker’ has many ‘Offered_jobs’s, a ‘Worker’ has many ‘Approved_job’s, A ‘Bid’ belongs to a ‘Worker’ and an ‘Offered_job’. An ‘Approved_job’ belongs to an ‘Offered_job’ and a ‘Worker’. ‘Worker’ – ‘Offered_job’ is many to many relationship. ‘Approved_job’ – ‘Completed_job’ has a one to one relationship.

Schema looks like this: workers table id integer first_name string last_name string phone string email string location string title string password string

offered_jobs table id integer title string wage float hours integer

bids id integer offered_job_id integer worker_id integer Amount float

approved_job Id Integer offered_job_id integer worker_id integer amount float hours integer progress integer

completed_jobs table Id integer title string rating integer paid boolean certificate integer

Each worker (either a Contractor or Personnel Manager) will need to login to via command line interface to access their respective privileges. The worker title can be either personnel manager or contractor. The personnel manager can post new jobs. A contractor can update their approved_job progress. Once a job is 100% complete, the personnel manager can rate it and add it to the completed_jobs table. 
