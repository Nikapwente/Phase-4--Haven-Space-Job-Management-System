import React, { useState } from "react";

function ProfileCard({ userData, onUpdate }) {
    const [updatedData, setUpdatedData] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdatedData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };  

    const handleUpdate = () => {
        // Send updated data to the backend
        onUpdate(updatedData);
    };

    return (
        <>
            <div className="row ms-5 mx-auto" id={userData.id}>
                <div
                    id={userData.id}
                    className="col bg-light mt-5 mb-5 border border-secondary rounded"
                    style={{ width: "1000px", height: "500px" }}
                >
                    <div className="mt-2" id={userData.id}>
                        <img id={userData.id} src={userData.image} alt="Profile" />
                    </div>
                    <div className="mt-2" id={userData.id}>
                        <label htmlFor="firstName">First Name:</label>
                        <input
                            type="text"
                            id="firstName"
                            name="first_name"
                            value={updatedData.first_name || userData.first_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-2" id={userData.id}>
                        <label htmlFor="lastName">Last Name:</label>
                        <input
                            type="text"
                            id="lastName"
                            name="last_name"
                            value={updatedData.last_name || userData.last_name}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-2" id={userData.id}>
                        <label htmlFor="bio">Bio:</label>
                        <textarea
                            id="bio"
                            name="about"
                            value={updatedData.about || userData.about}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-2" id={userData.id}>
                        <label htmlFor="location">Location:</label>
                        <input
                            type="text"
                            id="location"
                            name="location"
                            value={updatedData.location || userData.location}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-2" id={userData.id}>
                        <label htmlFor="phone">Phone:</label>
                        <input
                            type="text"
                            id="phone"
                            name="phone"
                            value={updatedData.phone || userData.phone}
                            onChange={handleChange}
                        />
                    </div>
                    <div className="mt-2" id={userData.id}>
                        <button className="btn btn-primary" onClick={handleUpdate}>
                            Update
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ProfileCard;
