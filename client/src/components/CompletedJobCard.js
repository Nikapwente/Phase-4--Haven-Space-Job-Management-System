import React from "react";

function CompletedJobCard({id, title, amount, paid, certificate}) {

    return (
        <>
            <div className="card mt-5 mb-5 ms-5 bg-light" style={{ "width": "250px" }} >
                <div className="card-body">
                    <h5 className="card-title">{title}</h5>
                    <p className="card-text">ID: {id}</p>
                    <p className="card-text">Amount: $ {amount}.00</p>
                    <p className="card-text">Paid Status: {paid? "Yes":"No"}</p>
                    <p className="card-text">Certificate {certificate}</p>
                </div>
            </div>
        </>
    )
}

export default CompletedJobCard;