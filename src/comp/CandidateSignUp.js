import React, { useState } from 'react';
import axios from 'axios';
import adminRegisterLogo from '../images/adminRegisterLogo.png';
import Background from './Background';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from './Loader';
const CandidateSignUp = (props) => {
    const [name, setName] = useState();
    const [email, setEmail] = useState();
    const [contact, setContact] = useState();
    const [password, setPassword] = useState();
    const [confirmPassword, setConfirmPassword] = useState();
    const [key, setKey] = useState();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            Swal.fire("Try Again !", "Password doesn't match", "warning")
            return;
        }
        try {
            setLoading(true);
            await axios.post('http://localhost:5000/candidateReg', { name, email, contact, password, key });
            Swal.fire('Registered !', 'Registered Successfully', 'success');
            setLoading(false);
            navigate('/login');
        } catch (error) {
            setLoading(false);
            Swal.fire('Error !', 'Some error occurred', 'error');
            console.log(error);
        }
    };

    // Set loading
    if (loading) {
        return <Loader />
    }

    return (
        <>
            {Background()}
            <div className="container" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                <form name='candidateSignUp'>
                    <div className="mb-3">
                        <h3 className='text-center'><img className="me-2 mb-2" src={adminRegisterLogo} alt="Logo" height="40" width="40" />Candidate Registration</h3>
                        <label htmlFor="name" className="form-label" >Username</label>
                        <input type="text" placeholder='Name' className="form-control" id="name" onChange={(e) => setName(e.target.value)} required={true} autoComplete='off' maxLength="50" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email</label>
                        <input type="text" placeholder='example@gmail.com' className="form-control" id="email" onChange={(e) => setEmail(e.target.value)} required={true} autoComplete='off' maxLength="50" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="contact" className="form-label">Contact</label>
                        <input type="tel" placeholder='Your contact number' className="form-control" id="contact" onChange={(e) => setContact(e.target.value)} required={true} autoComplete='off' maxLength="10" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input type="password" placeholder='Password ' className="form-control" id="password" onChange={(e) => setPassword(e.target.value)} required={true} autoComplete='off' maxLength="50" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                        <input type="password" placeholder='Confirm Password ' className="form-control" id="confirmPassword" onChange={(e) => setConfirmPassword(e.target.value)} required={true} autoComplete='off' maxLength="50" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="key" className="form-label">Secret Key</label>
                        <input type="text" placeholder='Create a new secret key ' className="form-control" id="key" onChange={(e) => setKey(e.target.value)} required={true} autoComplete='off' />
                    </div>
                    <details className='text-danger'>
                        <summary>Note :</summary> The secret key is required to change your password. If lost, you may lose access to your account.
                    </details>
                    <hr />
                    <center>
                        <button type="submit" className="btn mb-3 btn-info w-100" id="authenticate" onClick={handleRegister}>Register</button>

                        <Link type="submit" role="button" className="btn btn-info w-100" id="backLogin" to={"/login"}>Back</Link>
                    </center>
                </form>
            </div>
        </>
    )
}

export default CandidateSignUp;