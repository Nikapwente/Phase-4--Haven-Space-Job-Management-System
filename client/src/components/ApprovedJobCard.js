import React, {useState, useEffect} from "react";


function ApprovedJobCard({ id, hours, progress, amount, title }) {

    const [newProgress, setNewProgress] = useState(progress);
    

    const handleProgressUpdate = async () => {
        try {
            const response = await fetch(`/approved_jobs/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ progress: newProgress }),
            });

            if (response.ok) {
                console.log('Progress updated successfully!');
                alert('Updated Successfully!');
                // Success Logic
                
                const storedSelectedUser = sessionStorage.getItem('selectedUser');
                const activeUser = JSON.parse(storedSelectedUser);
                const updatedApprovedJobs = activeUser.approved_jobs.map(job => {
                    if (job.id === id) {
                        return { ...job, progress: newProgress };
                    }
                    return job;
                });
                activeUser.approved_jobs = updatedApprovedJobs;
                sessionStorage.setItem('selectedUser', JSON.stringify(activeUser));
                
            } else {
                console.error('Failed to update progress');
                // Failure Logic
            }
        } catch (error) {
            console.error('Error updating progress:', error);
        }
    };

    return (
        <>
            <div className="card mt-5 mb-5 ms-5 bg-light" style={{ width: "250px" }} >
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">ID: {id}</p>
                    <p className="card-text">Hours: {hours}</p>
                    <p className="card-text">Amount: $ {amount}.00</p>
                    <div className="progress mt-2 mb-3">
                        <div className="progress-bar bg-success" role="progressbar" style={{ width: `${newProgress}%` }} aria-valuenow={newProgress} aria-valuemin="0" aria-valuemax="100">Progress: {newProgress}%</div>
                    </div>
                    <input
                        type="range"
                        className="form-range"
                        min="0"
                        max="100"
                        value={newProgress}
                        onChange={(e) => setNewProgress(e.target.value)}
                    />
                    <button className="btn btn-primary mt-2" onClick={handleProgressUpdate}>Update Progress</button>
                </div>
            </div>
        </>
    );
}

export default ApprovedJobCard;