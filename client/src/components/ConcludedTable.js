import React from "react";
import ConcludedTableEntry from "../ConcludedTableEntry";

function ConcludedTable({ concludedData, update }) {

    return (
        <>
            <table className="table">
                <thead>
                    <tr>
                        <th scope="col">ID</th>
                        <th scope="col">Job Title</th>
                        <th scope="col">Contractor</th>
                        <th scope="col">Amount</th>
                        <th scope="col">Hours</th>
                        <th scope="col">Rating</th>
                        <th scope="col">Mark Complete</th>
                    </tr>
                </thead>
                <tbody>
                    {concludedData.map((item) => {
                        return <ConcludedTableEntry
                            key={item.id}
                            id={item.id}
                            title={item.title}
                            contractor={item.contractor}
                            amount={item.amount}
                            hours={item.hours}
                            concludedData={concludedData}
                            update={update}
                        />
                    })}
                </tbody>
            </table>
        </>
    )
}

export default ConcludedTable;