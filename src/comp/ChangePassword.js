import React, { useState } from 'react'
import axios from 'axios'
import passwordLogo from '..//images/passwordLogo.png'
import Swal from 'sweetalert2'
import Background from './Background'
import { Link, useNavigate } from 'react-router-dom'
import Loader from './Loader';

function ChangePassword(props) {
    const navigate = useNavigate();
    const [email, setEmail] = useState();
    const [password, setPassword] = useState();
    const [loading, setLoading] = useState(false);
    const [confirmPassword, setConfirmPassword] = useState();
    const [key, setKey] = useState();

    const handleChangePass = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            Swal.fire("Try Again !", "Password doesn't match", "warning")
            return;
        }
        try {
            setLoading(true);
            const response = await axios.post('http://localhost:5000/changePass', {
                email,
                password,
                key
            });
            if (response.data.success) {
                setLoading(false);
                Swal.fire('Success !', 'Your password has been changed successfully', 'success')
                navigate('/login')
            } else {
                setLoading(false);
                Swal.fire('Error !', 'Password not changed, some error occurred !', 'error')
            }
        }
        catch (error) {
            setLoading(false);
            console.log(error);
            Swal.fire('Error !', 'Some error occurred !', 'error')
        }
    };

    if(loading) {
        return <Loader />
    }

    return (
        <>
            {Background()}
            <div className="container position-relative" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                <form name='adminLogin'>
                    <div className="text-center">
                        <h3> <img className="me-1 mb-1" src={passwordLogo} alt="Logo" height="35" width="35" /> Change Password </h3>
                    </div>
                    <div className="mb-3">
                        <label htmlFor="email" className="form-label">Email ID</label>
                        <input type="text" name='email' placeholder='Enter email' className="form-control" id="email" onChange={(e) => setEmail(e.target.value)} autoComplete='off' required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="changePass" className="form-label">New Password</label>
                        <input type="password" name="changePass" placeholder='Enter new password' className="form-control" id="changePass" onChange={(e) => setPassword(e.target.value)} autoComplete='off' required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="confirmChangePass" className="form-label">Confirm New Password</label>
                        <input type="password" name="confirmChangePass" placeholder='Confirm new password' className="form-control" id="confirmChangePass" onChange={(e) => setConfirmPassword(e.target.value)} autoComplete='off' required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="checkKey" className="form-label">Secret Key</label>
                        <input type="text" name="checkKey" placeholder='Enter your secret key' className="form-control" id="checkKey" onChange={(e) => setKey(e.target.value)} autoComplete='off' required />
                    </div> <hr />
                    <center>
                        <button type="submit" className="btn btn-danger w-100" id="btnChangePass" onClick={handleChangePass}>Change Password</button><br />
                        <Link type="submit" role="button" className="btn mt-3 w-100 btn-info w-50" id="backLogin" to={"/login"}>Back to Login</Link>
                    </center>
                </form>
            </div>
        </>
    )
}

export default ChangePassword
