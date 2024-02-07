import React, {useState} from "react";

function NewJobCard({ id, hours, amount, title, userId, update }) {
    const [bidAmount, setBidAmount] = useState(0);

    const handleBidSubmit = async () => {
        try {
            // const response = await fetch(`/jobs/${id}/bids`, {
                
            const response = await fetch(`/bids/${id}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    amount: bidAmount,
                    offered_job_id: id,
                    worker_id: userId,
                }),
            });

            if (response.ok) {
                console.log('Bid placed successfully!');
                // Success Logic
                const storedSelectedUser = sessionStorage.getItem('selectedUser');
                const activeUser = JSON.parse(storedSelectedUser);
                const updatedActiveUser = {
                    ...activeUser,
                    new_jobs: activeUser.new_jobs.filter(job => job.id !== id),
                    bids: [...activeUser.bids, { amount: bidAmount, job_id: id }],
                };
                update(prevCounter => prevCounter + 1);
                // Update the session storage with the updated activeUser object
                sessionStorage.setItem('selectedUser', JSON.stringify(updatedActiveUser));
            } else {
                console.error('Failed to place bid');
                // Failed Logic
            }
        } catch (error) {
            console.error('Error placing bid:', error);
        }
    };

    return (
        <>
            <div className="card mt-5 mb-5 ms-5 bg-light" style={{ "width": "250px" }} >
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">ID: {id}</p>
                    <p className="card-text">Hours: {hours}</p>
                    <p className="card-text">Amount: $ {amount}.00</p>
                    <div className="form-group">
                        <label htmlFor="bidAmount">Bid Amount:</label>
                        <input type="number" className="form-control mt-1" id="bidAmount" value={bidAmount} onChange={(e) => setBidAmount(e.target.value)} />
                    </div>
                    <button className="btn btn-primary mt-3" onClick={handleBidSubmit}>Place Bid</button>
                </div>
            </div>
        </>
    )
}

export default NewJobCard;