import React from "react";

function TableEntry({ id, title, offered_amount, contractor_rating, contractor, amount, hours }) {

    const bid_quality_points = 0.7 * contractor_rating + (offered_amount / amount * 30)
    return (
        <>
            <tr>
                <th scope="row">{id}</th>
                <td>{title}</td>
                <td>{offered_amount}</td>

                <td>{amount}</td>
                <td>{contractor}</td>
                <td>
                    <div className="progress mt-2">
                        <div id={`progress-bar-${id}`} className="progress-bar" role="progressbar" style={{ "width": `${(contractor_rating / 10) * 100}%` }} aria-valuenow={contractor_rating} aria-valuemin="0" aria-valuemax="10">{contractor_rating.toFixed(2)}</div>
                    </div>

                </td>
                <td>
                    <div className="progress mt-2">
                        <div id={`progress-bar-${id}`} className="progress-bar" role="progressbar" style={{ "width": `${bid_quality_points}%` }} aria-valuenow={bid_quality_points} aria-valuemin="0" aria-valuemax="10">{bid_quality_points.toFixed(2)}</div>
                    </div>
                </td>
                <td>
                    <button className="btn btn-warning m-2">Approve</button>

                </td>
            </tr>

        </>
    )
}

export default TableEntry;