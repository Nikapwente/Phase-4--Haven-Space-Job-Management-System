import React from "react";
import { useState } from 'react';
import ApprovedJobCard from "./ApprovedJobCard";
import NewJobCard from "./NewJobCard";
import CompletedJobCard from "./CompletedJobCard";
import BidCard from "./BidCard";


function Home({ selectedUser }) {

    const [selectedItem, setSelectedItem] = useState('');

    const storedSelectedUser = sessionStorage.getItem('selectedUser');
    const activeUser = JSON.parse(storedSelectedUser);

    const handleItemClick = (item) => {
        setSelectedItem(item);
        // You can add additional logic or navigation here
        // console.log(selectedUser);
        console.log(activeUser.title);
    };

    

    return (

        <>
            {activeUser ? (
                <>

                    <div>
                        <div className="row">
                            {/* left column */}

                            <div className="ms-5 mt-5 col-4" style={{ "width": "250px" }}>
                                
                                <h4>{activeUser.name}, {activeUser.title}</h4>
                                <div className="list-group" style={{ "width": "250px" }}>
                                    <a
                                        href="#"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'New Jobs' && 'active'}`}
                                        onClick={() => handleItemClick('New Jobs')}
                                    >
                                        New Jobs
                                    </a>
                                    <a
                                        href="#"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'Jobs in Progress' && 'active'}`}
                                        onClick={() => handleItemClick('Jobs in Progress')}
                                    >
                                        Jobs in Progress
                                    </a>
                                    <a
                                        href="#"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'Completed Jobs' && 'active'}`}
                                        onClick={() => handleItemClick('Completed Jobs')}
                                    >
                                        Completed Jobs
                                    </a>
                                    <a
                                        href="#"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'Bids' && 'active'}`}
                                        onClick={() => handleItemClick('Bids')}
                                    >
                                        Bids
                                    </a>
                                    {activeUser.title === 'contractor' && (
                                    <a
                                        href="#"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'Active Bids' && 'active'}`}
                                        onClick={() => handleItemClick('Active Bids')}
                                    >
                                        Active Bids
                                    </a>
                                    )}
                                    <a
                                        href="#"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'Settings' && 'active'}`}
                                        onClick={() => handleItemClick('Settings')}
                                    >
                                        Settings
                                    </a>
                                    <a
                                        href="/login"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'Logout' && 'active'}`}
                                        onClick={() => handleItemClick('Logout')}
                                    >
                                        Logout
                                    </a>

                                </div>
                            </div>
                            {/* right column */}
                            {selectedItem === 'Jobs in Progress' && (
                                <div className="ms-5 col-4 d-flex align-content-end flex-wrap" style={{ "width": "1000px" }}>
                                    {activeUser.approved_jobs.map((item) => {
                                        return <ApprovedJobCard
                                            key={item.id}
                                            id={item.id}
                                            amount={item.amount}
                                            hours={item.hours}
                                            progress={item.progress}
                                            title={item.title}
                                            
                                        />
                                    })}
                                </div>
                            )}
                            {selectedItem === 'New Jobs' && (
                                <div className="ms-5 col-4 d-flex align-content-end flex-wrap" style={{ "width": "1000px" }}>
                                    {activeUser.new_jobs.map((item) => {
                                        return <NewJobCard
                                            key={item.id}
                                            id={item.id}
                                            amount={item.wage}
                                            hours={item.hours}
                                            title={item.title}
                                        />
                                    })}
                                </div>
                            )}
                            {selectedItem === 'Completed Jobs' && (
                                <div className="ms-5 col-4 d-flex align-content-end flex-wrap" style={{ "width": "1000px" }}>
                                    {activeUser.completed_jobs.map((item) => {
                                        return <CompletedJobCard
                                            key={item.id}
                                            id={item.id}
                                            amount={item.amount}
                                            certificate={item.certificate}
                                            paid={item.paid}
                                            title={item.title}
                                        />
                                    })}
                                </div>
                            )}
                            {selectedItem === 'Bids' && (
                                <div className="ms-5 col-4 d-flex align-content-end flex-wrap" style={{ "width": "1000px" }}>
                                    {activeUser.bids.map((item) => {
                                        return <BidCard
                                            key={item.id}
                                            id={item.id}
                                            amount={item.offered_job_wage}
                                            hours={item.offered_job_hours}
                                            title={item.offered_job_title}
                                        />
                                    })}
                                </div>
                            )}
                            {selectedItem === 'Active Bids' && (
                                <div className="ms-5 col-4 d-flex align-content-end flex-wrap" style={{ "width": "1000px" }}>
                                    {activeUser.active_bids.map((item) => {
                                        return <BidCard
                                            key={item.id}
                                            id={item.id}
                                            amount={item.offered_job_wage}
                                            hours={item.offered_job_hours}
                                            title={item.offered_job_title}
                                        />
                                    })}
                                </div>
                            )}

                        </div>


                    </div>
                </>) : (
                <p>Need to Login...</p>
            )}

        </>
    )

}

export default Home;