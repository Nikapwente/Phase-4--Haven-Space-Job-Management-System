import React from "react";
import { useState } from 'react';

function NewJob({ update }) {


    const [title, setTitle] = useState("");
    const [wage, setWage] = useState(0);
    const [hours, setHours] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();

        fetch('/offered_jobs', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: title,
                wage: wage,
                hours: hours
            }),
        })
            .then(response => {
                if (response.ok) {
                    
                    console.log('New Job Created!');
                    alert('New Job Created!');
                    update(prevCounter => prevCounter + 1);
                    setTitle("");
                    setHours(0);
                    setWage(0);
                } else {
                    throw new Error('Failed to post job');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Error: Job could not be posted');
            });
    };
    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3 ms-5" style={{ width: '400px' }}>
                <div className="mb-3">
                    <label htmlFor="title" className="form-label">Title:</label>
                    <input type="text" className="form-control" id="title" value={title} onChange={e => setTitle(e.target.value)} />
                </div>
                <div className="mb-3">
                    <label htmlFor="wage" className="form-label">Wage:</label>
                    <input type="number" className="form-control" id="wage" value={wage} onChange={e => setWage(parseInt(e.target.value))} />
                </div>
                <div className="mb-3">
                    <label htmlFor="hours" className="form-label">Hours:</label>
                    <input type="number" className="form-control" id="hours" value={hours} onChange={e => setHours(parseInt(e.target.value))} />
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </form>
    );
}

export default NewJob;