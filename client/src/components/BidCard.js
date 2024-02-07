import React from "react";

function BidCard({ id, hours, offered_amount, title, bid_amount }) {

    return (
        <>
            <div className="card mt-5 mb-5 ms-5 bg-light" style={{ "width": "250px" }} >
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">ID: {id}</p>
                    <p className="card-text">Hours: {hours}</p>
                    <p className="card-text">Offered Amount: $ {offered_amount}.00</p>
                    <p className="card-text">Bid Amount: $ {bid_amount}.00</p>
                </div>
            </div>
        </>
    )
}

export default BidCard;