import React from "react";
import { useState, useEffect } from 'react';
import ApprovedJobCard from "./ApprovedJobCard";
import NewJobCard from "./NewJobCard";
import CompletedJobCard from "./CompletedJobCard";
import BidCard from "./BidCard";
import Table from "./Table";


function Home({ selectedUser }) {

    const [selectedItem, setSelectedItem] = useState('');

    const [data, setData] = useState(null);
    const [counter, setCounter] = useState(0);
    const [bidData, setBidData] = useState([]);


    const storedSelectedUser = sessionStorage.getItem('selectedUser');
    const activeUser = JSON.parse(storedSelectedUser);

    useEffect(() => {
        fetch(`/workers/${activeUser.id}`)
            .then(resp => resp.json())
            .then(data => { setData(data); })
    }, [counter,activeUser.id])


    useEffect(() => {
        fetch(`/unapproved_bids`)
            .then(resp => resp.json())
            .then(data => { setBidData(data); })
    }, [counter])


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
                                        className={`list-group-item list-group-item-action ${selectedItem === 'Available Jobs' && 'active'}`}
                                        onClick={() => handleItemClick('Available Jobs')}
                                    >
                                        Available Jobs
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
                                    {activeUser.title === 'personnel manager' && (
                                        <a
                                            href="#"
                                            className={`list-group-item list-group-item-action ${selectedItem === 'Approve Bids' && 'active'}`}
                                            onClick={() => handleItemClick('Approve Bids')}
                                        >
                                            Approve Bids
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
                                            userId={activeUser.id}

                                        />
                                    })}
                                </div>
                            )}
                            {selectedItem === 'Available Jobs' && (
                                <div className="ms-5 col-4 d-flex align-content-end flex-wrap" style={{ "width": "1000px" }}>
                                    {activeUser.new_jobs.map((item) => {
                                        return <NewJobCard
                                            key={item.id}
                                            id={item.id}
                                            amount={item.wage}
                                            hours={item.hours}
                                            title={item.title}
                                            userId={activeUser.id}
                                            update={setCounter}
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
                                    {data.bids.map((item) => {
                                        return <BidCard
                                            key={item.id}
                                            id={item.id}
                                            offered_amount={item.offered_job_wage}
                                            hours={item.offered_job_hours}
                                            title={item.offered_job_title}
                                            bid_amount={item.amount}
                                        />
                                    })}
                                </div>
                            )}
                            {selectedItem === 'Active Bids' && (
                                <div className="ms-5 col-4 d-flex align-content-end flex-wrap" style={{ "width": "1000px" }}>
                                    {data.active_bids.map((item) => {
                                        return <BidCard
                                            key={item.id}
                                            id={item.id}
                                            offered_amount={item.offered_job_wage}
                                            hours={item.offered_job_hours}
                                            title={item.offered_job_title}
                                            bid_amount={item.amount}
                                        />
                                    })}
                                </div>
                            )}

                            {selectedItem === 'Approve Bids' && (
                                <div className="ms-5 col-4 d-flex align-content-end flex-wrap" style={{ "width": "1000px" }}>
                                    <Table bidData={bidData}/>
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