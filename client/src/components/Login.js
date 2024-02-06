import { useState } from 'react';
import React from "react";
import { useNavigate } from "react-router-dom";

function Login({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');


    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams({
                    email,
                    password,
                }),
            });

            if (response.ok) {
                console.log('Login successful!');
                // Login Action
                const data = await response.json();
                onLogin(data); // Pass user data to the callback function
                // test
                sessionStorage.setItem('selectedUser', JSON.stringify(data));
                // sessionStorage.setItem('selectedUser', data);
                console.log(data)
                navigate('/home');
            } else {
                const data = await response.json();
                console.error('Login failed:', data.Error);
                // Failed Login Action
            }
        } catch (error) {
            console.error('Error during login:', error);
        }
    };


    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3 ms-5" style={{ "width": "400px" }}>
                <div className="mb-3">
                    <label htmlFor="email" className="form-label">Email address</label>
                    <input type="email" className="form-control" id="email" aria-describedby="emailHelp" value={email} onChange={(event) => setEmail(event.target.value)} />
                    <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                </div>
                <div className="mb-3">
                    <label htmlFor="password" className="form-label">Password</label>
                    <input type="password" className="form-control" id="password" value={password} onChange={(event) => setPassword(event.target.value)} />
                </div>
                <div className="mb-3">
                    <p><a className="link-opacity-100" href="/signup">Sign Up?</a></p>
                </div>
                <button type="submit" className="btn btn-primary">Submit</button>
            </div>
        </form>

    );
}

export default Login;