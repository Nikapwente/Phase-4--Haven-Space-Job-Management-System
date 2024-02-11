import React from "react";

function TableEntry({ id, title, offered_amount, contractor_rating, contractor, amount, bidData, update }) {

    const bid_quality_points = 0.7 * contractor_rating + (offered_amount / amount * 30);

    const handleApproveBid = (event) => {
        // Request to backend to approve bid

        // Function to find an object by its id
        
        const findObjectById = (id) => {
            return bidData.find(obj => obj.id === id);
        };
        const bidId = parseInt(event.target.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.textContent);
        const bidObject = findObjectById(bidId);
        console.log(bidObject);

        console.log(event.target.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.textContent);
        fetch(`/approved_jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                amount : bidObject.amount,
                hours : bidObject.hours,
                worker_id : bidObject.worker_id,
                offered_job_id : bidObject.offered_job_id,
                progress: 0,


                // Include any additional data you need to send to the backend
            }),
        })
            .then(response => {
                if (response.ok) {
                    // Update the UI to reflect the approval
                    update(prevCounter => prevCounter + 1);
                    console.log('Bid approved successfully!');
                } else {
                    console.error('Failed to approve bid');
                }
            })
            .catch(error => {
                console.error('Error approving bid:', error);
            });
    };

    return (
        <tr>
            <th scope="row">{id}</th>
            <td>{title}</td>
            <td>{offered_amount}</td>
            <td>{amount}</td>
            <td>{contractor}</td>
            <td>
                <div className="progress mt-2">
                    <div id={`progress-bar-rating-${id}`} className="progress-bar" role="progressbar" style={{ "width": `${(contractor_rating / 10) * 100}%` }} aria-valuenow={contractor_rating} aria-valuemin="0" aria-valuemax="10">{contractor_rating.toFixed(2)}</div>
                </div>
            </td>
            <td>
                <div className="progress mt-2">
                    <div id={`progress-bar-quality-${id}`} className="progress-bar" role="progressbar" style={{ "width": `${bid_quality_points}%` }} aria-valuenow={bid_quality_points} aria-valuemin="0" aria-valuemax="100">{bid_quality_points.toFixed(2)}</div>
                </div>
            </td>
            <td>
                <button className="btn btn-warning m-2" onClick={handleApproveBid}>Approve</button>
            </td>
        </tr>
    );
}

export default TableEntry;
