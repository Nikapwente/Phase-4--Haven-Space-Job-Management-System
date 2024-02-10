import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function SignUp() {

    const [confirmPassword, setConfirmPassword] = useState("");
    const [formData, setFormData] = useState({
        email: "",
        first_name: "",
        last_name: "",
        phone: "",
        password: "",
        title: "contractor",
    });

    const collectData = (event) => {
        event.preventDefault();

        setFormData({
            ...formData,
            [event.target.id]: event.target.value,
        })

    }



    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/workers', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: new URLSearchParams(formData),
            });

            if (response.ok) {
                console.log('Sign-up successful!');
                navigate('/login'); // Redirect to login page after successful sign-up
            } else {
                const data = await response.json();
                console.error('Sign-up failed:', data.Error);
                alert('Sign Up failed, Email exists!');
                // Handle failed sign-up (e.g., display error message)
            }
        } catch (error) {
            console.error('Error during sign-up:', error);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit}>
                <div className="mb-3 ms-5" style={{ width: '400px' }}>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email address</label>
                        <input type="email" className="form-control" id="email" aria-describedby="emailHelp"
                            value={formData.email} onChange={collectData} />
                        <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="first_name" className="form-label">First Name</label>
                        <input type="text" className="form-control" id="first_name" aria-describedby="emailHelp"
                            value={formData.first_name} onChange={collectData} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="last_name" className="form-label">Last Name</label>
                        <input type="text" className="form-control" id="last_name" aria-describedby="emailHelp"
                            value={formData.last_name} onChange={collectData} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="phone" className="form-label">Phone</label>
                        <input type="text" className="form-control" id="phone" aria-describedby="emailHelp"
                            value={formData.phone} onChange={collectData} />
                    </div>





                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" className="form-control" id="password" value={formData.password}
                            onChange={collectData} />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirm_password" className="form-label">Confirm Password</label>
                        <input type="password" className="form-control" id="confirm_password" value={confirmPassword}
                            onChange={(event) => setConfirmPassword(event.target.value)} />
                    </div>
                    <div className="mb-3">
                        <p>Already have an account? <Link to="/login" className="link-opacity-100">Login</Link></p>
                    </div>
                    <button type="submit" className="btn btn-primary">Sign Up</button>
                </div>
            </form>
        </>
    );
}

export default SignUp;
