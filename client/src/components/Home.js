import React from "react";
import { useState, useEffect } from 'react';
import ApprovedJobCard from "./ApprovedJobCard";
import NewJobCard from "./NewJobCard";
import CompletedJobCard from "./CompletedJobCard";
import UnapprovedBidCard from "./UnapprovedBidCard";
import BidCard from "./BidCard";
import Table from "./Table";
import ProfileCard from "./ProfileCard";
import ConcludedTable from "./ConcludedTable";
import { useNavigate } from "react-router-dom";
import NewJob from "./NewJob";


function Home({ selectedUser }) {

    const [selectedItem, setSelectedItem] = useState('');
    const navigate = useNavigate();
    const [data, setData] = useState({});
    const [counter, setCounter] = useState(0);
    const [bidData, setBidData] = useState([]);
    const [concludedData, setConcludedData] = useState([]);

    

    const storedSelectedUser = sessionStorage.getItem('selectedUser');
    const activeUser = JSON.parse(storedSelectedUser);

    useEffect(() => {
        if (!activeUser) {
            window.location.replace("/login");
        }
    }, [activeUser]);

    useEffect(() => {
        if (!activeUser) {
            navigate('/');
        } else
        fetch(`/workers/${activeUser.id}`)
            .then(resp => resp.json())
            .then(data => { setData(data); })
    }, [counter])


    useEffect(() => {
        fetch(`/unapproved_bids`)
            .then(resp => resp.json())
            .then(data => { setBidData(data); })
    }, [counter])

    useEffect(() => {
        fetch(`/concluded_jobs`)
            .then(resp => resp.json())
            .then(data => { setConcludedData(data); })
    }, [counter])


    const handleItemClick = (item) => {
        setSelectedItem(item);
        // console.log(selectedUser);
        console.log(activeUser);
        console.log(data);
        if (item == "Logout") {
            sessionStorage.removeItem('selectedUser');
        }
    };

    const handleUpdateProfile = (updatedData) => {

        // Send updated profile data to the backend
        fetch(`/workers/${activeUser.id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedData),
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to update profile');
                }

                // If update successful, trigger a counter to refresh the data
                console.log(updatedData);
                setCounter(counter + 1);
                alert('Updated successfull!');
            })
            .catch(error => {
                console.error('Error updating profile:', error);

            });
    };

    let trimmedPath = data.image ? data.image.replace("../client/public", "") : "";
    let plain = "/images/default.jpg"

    return (

        <>
            {activeUser ? (
                <>

                    <div >
                        <div className="row" >
                            {/* left column */}

                            <div className="ms-5 mt-5 col-4" style={{ "width": "250px", "height":"700px" }}>

                                <h4>{activeUser.name}, {activeUser.title}</h4>
                                <div className="mt-2 mb-2 ms-5" id={activeUser.id} ><img className="border border-secondary rounded" id={activeUser.id} src={trimmedPath? trimmedPath:plain } style={{ height: "100px" }}></img></div>
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
                                    {activeUser.title === 'personnel manager' && (
                                        <a
                                            href="#"
                                            className={`list-group-item list-group-item-action ${selectedItem === 'Concluded Jobs' && 'active'}`}
                                            onClick={() => handleItemClick('Concluded Jobs')}
                                        >
                                            Concluded Jobs
                                        </a>
                                    )}
                                    {activeUser.title === 'personnel manager' && (
                                        <a
                                            href="#"
                                            className={`list-group-item list-group-item-action ${selectedItem === 'Post New Job' && 'active'}`}
                                            onClick={() => handleItemClick('Post New Job')}
                                        >
                                            Post New Job
                                        </a>
                                    )}

                                    <a
                                        href="#"
                                        className={`list-group-item list-group-item-action ${selectedItem === 'Your Profile' && 'active'}`}
                                        onClick={() => handleItemClick('Your Profile')}
                                    >
                                        Your Profile
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
                                <div className="ms-5 col-4 d-flex align-content-start flex-wrap" style={{ "width": "1000px" }}>
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
                                <div className="ms-5 col-4 d-flex align-content-start flex-wrap" style={{ "width": "1000px" }}>
                                    {data.new_jobs.map((item) => {
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
                                <div className="ms-5 col-4 d-flex align-content-start flex-wrap" style={{ "width": "1000px" }}>
                                    {activeUser.completed_jobs.map((item) => {
                                        return <CompletedJobCard
                                            key={item.id}
                                            id={item.id}
                                            amount={item.amount}
                                            certificate={item.certificate}
                                            paid={item.paid}
                                            title={item.title}
                                            rating={item.rating}
                                        />
                                    })}
                                </div>
                            )}
                            {selectedItem === 'Bids' && (
                                <div className="ms-5 col-4 d-flex align-content-start flex-wrap" style={{ "width": "1000px" }}>
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
                                <div className="ms-5 col-4 d-flex align-content-start flex-wrap" style={{ "width": "1000px" }}>
                                    {data.active_bids.map((item) => {
                                        return <UnapprovedBidCard
                                            key={item.id}
                                            id={item.id}
                                            offered_amount={item.offered_job_wage}
                                            hours={item.offered_job_hours}
                                            title={item.offered_job_title}
                                            bid_amount={item.amount}
                                            update={setCounter}
                                        />
                                    })}
                                </div>
                            )}

                            {selectedItem === 'Approve Bids' && (
                                <div className="ms-5 col-4 d-flex align-content-end flex-wrap" style={{ "width": "1000px" }}>
                                    <Table bidData={bidData} update={setCounter} />
                                </div>
                            )}

                            {selectedItem === 'Concluded Jobs' && (
                                <div className="ms-5 col-4 d-flex align-content-start flex-wrap" style={{ "width": "1000px", padding:"50px" }}>
                                    <ConcludedTable concludedData={concludedData} update={setCounter} />
                                </div>
                            )}

                            {selectedItem === 'Your Profile' && (
                                <div className="ms-5 col-4 d-flex align-content-end flex-wrap" style={{ "width": "1000px" }}>
                                    <ProfileCard userData={data} onUpdate={handleUpdateProfile} />
                                </div>
                            )}
                            {selectedItem === 'Post New Job' && (
                                <div className="ms-5 col-4 d-flex align-content-start flex-wrap" style={{ "width": "1000px" }}>
                                    <NewJob update={setCounter} />
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