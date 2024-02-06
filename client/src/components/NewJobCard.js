import React from "react";

function NewJobCard({ id, hours, amount, title }) {

    return (
        <>
            <div className="card mt-5 mb-5 ms-5 bg-light" style={{ "width": "250px" }} >
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">ID: {id}</p>
                    <p className="card-text">Hours: {hours}</p>
                    <p className="card-text">Amount: $ {amount}.00</p>
                    <a href="#" className="btn btn-primary">Place Bid</a>
                </div>
            </div>
        </>
    )
}

export default NewJobCard;