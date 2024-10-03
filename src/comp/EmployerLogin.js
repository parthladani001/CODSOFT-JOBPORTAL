import React, { useState } from 'react'
import axios from 'axios'
import Swal from 'sweetalert2'
import loginLogo from '../images/loginLogo.png'
import Background from './Background'
import Loader from './Loader'
import { Link, useLocation, useNavigate } from 'react-router-dom'
const EmployerLogin = (props) => {
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const location = useLocation();
    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const response = await axios.post('http://localhost:5000/employerLogin', {
                email,
                password
            });
            if (response.status === 200) {
                setLoading(false);
                // Call the login function passed from props to update user state in App.js
                props.login();

                // Store logged in users in local storage
                localStorage.setItem('employer', JSON.stringify(response.data._id));

                navigate('/employerDashboard');
                Swal.fire('Success !', 'You are now logged in', 'success');
            } else {
                setLoading(false);
                Swal.fire('Login Failed !', 'Invalid Credentials ! Please try again', 'error');
            }
        }
        catch (error) {
            setLoading(false);
            console.log(error);
            Swal.fire('Login Failed !', 'Inavalid Credentials ! Please try again', 'error');
        }
    };

    // Show loader if loading
    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {Background()}
            <div className="container" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                <form name='adminLogin'>
                    <div className="text-center">
                        <h3> <img className="me-2 mb-2" src={loginLogo} alt="Logo" height="30" width="30" /> Employer Login </h3>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email ID</label>
                        <input type="text" name='email' placeholder='Email' className="form-control" id="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" name='password' placeholder='Password' className="form-control" id="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
                    </div> <hr />
                    <h6 className='my-2'>Forgot Password? &nbsp;
                        <Link className={`${location.pathname === "/changeEmpPass" ? "active" : ""}`} to="/changeEmpPass">Change Here</Link>
                    </h6>
                    <h6 className='my-2'>Not a user? &nbsp;
                        <Link className={`${location.pathname === "/employerSignUp" ? "active" : ""}`} to="/employerSignUp">Create account</Link>
                    </h6>
                    <center>
                        <button type="submit" className="btn my-3 btn-info w-100" id="authenticate" onClick={handleLogin}>Authenticate</button>
                    </center>
                </form>
            </div>
        </>
    )
}

export default EmployerLogin;