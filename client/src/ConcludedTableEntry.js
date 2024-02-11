import React from "react";

function ConcludedTableEntry({ id, title, amount, contractor, hours, concludedData, update }) {


    const handleConcludedJob = (event) => {

        
        const approved_job_id_int = parseInt(event.target.parentElement.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.previousSibling.textContent)
        console.log(approved_job_id_int);

        const rating = parseInt(event.target.parentElement.previousSibling.firstChild.value);
        console.log(rating);
        fetch(`/completed_jobs`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                paid : false,
                rating : rating,
                approved_job_id : approved_job_id_int,



                // Include any additional data you need to send to the backend
            }),
        })
            .then(response => {
                if (response.ok) {
                    // Update the UI to reflect the approval
                    update(prevCounter => prevCounter + 1);
                    console.log('Completion Updated!');
                    alert('Completion Updated!');
                } else {
                    console.error('Failed to update');
                }
            })
            .catch(error => {
                console.error('Error updating:', error);
            });
    };

    return (
        <tr>
            <th scope="row">{id}</th>
            <td>{title}</td>
            <td>{contractor}</td>
            <td>{amount}</td>
            <td>{hours}</td>
            <td>
                <input type="number" min="1" max="10" />
            </td>

            <td>
                <button className="btn btn-warning m-2" onClick={handleConcludedJob}>Completed</button>
            </td>
        </tr>
    );
}

export default ConcludedTableEntry;
