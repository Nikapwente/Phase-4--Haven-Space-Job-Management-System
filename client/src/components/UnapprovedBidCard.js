import React from "react";

function UnapprovedBidCard({ id, hours, offered_amount, title, bid_amount, update }) {



    const handleDelete = (e) => {
        const bid = e.target.parentElement.firstChild.nextSibling.textContent;
        const bidId = bid.replace("ID:", "")
        const bidInt = parseInt(bidId);
        
        fetch(`/bids/${bidInt}`, {
            method: 'DELETE',
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to delete bid');
            }
            update(prevCounter => prevCounter + 1);
            alert('Bid deleted successfully!');
        })
        .catch(error => {
            console.error('Error deleting bid:', error);
        });
    };

    return (
        <>
            <div className="card mt-5 mb-5 ms-5 bg-light" style={{ "width": "250px" }} >
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">ID: {id}</p>
                    <p className="card-text">Hours: {hours}</p>
                    <p className="card-text">Offered Amount: $ {offered_amount}.00</p>
                    <p className="card-text">Bid Amount: $ {bid_amount}.00</p>
                    <button onClick={handleDelete} className="btn btn-danger">Delete</button> {/* Added delete button */}
                </div>
            </div>
        </>
    )
}

export default UnapprovedBidCard;