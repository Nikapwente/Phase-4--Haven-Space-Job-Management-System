import React from "react";
import TableEntry from "./TableEntry";

function Table({ bidData, update }) {

    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Job Title</th>
                        <th scope="col">Offered Amount</th>
                        <th scope="col">Bid Amount</th>
                        <th scope="col">Contractor</th>
                        <th scope="col">Contractor Rating</th>
                        <th scope="col">Bid Quality Points</th>
                    </tr>
                </thead>
                <tbody>
                    {bidData.map((item) => {
                        return <TableEntry
                            key={item.id}
                            id={item.id}
                            offered_amount={item.offered_amount}
                            title={item.offered_job_title}
                            amount={item.amount}
                            contractor={item.worker_name}
                            contractor_rating={item.worker_avg_rating}
                            bidData={bidData}
                            update={update}
                        />
                    })}
                </tbody>
            </table>
        </>
    )
}

export default Table;