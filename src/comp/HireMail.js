import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import Swal from 'sweetalert2';
import icon from '../images/contactUsLogo.png'
import Background from './Background';
import Loader from './Loader';

function HireMail(props) {
    const [loading, setLoading] = useState(false);
    const form = useRef();
    const sendEmail = (e) => {
        e.preventDefault();
        setLoading(true);
        emailjs
            .sendForm('YOUR_API', 'YOUR_TEMPLATE_ID', form.current, {
                publicKey: 'YOUR_PUBLIC_KEY',
            })
            .then(
                () => {
                    setLoading(false);
                    Swal.fire('Sent !', "E-mail is sent successfully", 'success')
                },
                (error) => {
                    setLoading(false);
                    console.log(error);
                    Swal.fire('Error !', 'Something went wrong', 'error')
                },

            );
    }

    // Set loading
    if (loading) {
        return <Loader />
    }

    return (
        <>
            {Background()}
            <div className="container" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                <h3><img className="me-2 mb-2" src={icon} alt="Logo" height="40" width="40" />Hire Candidate </h3>

                <h5>Send an e-mail to hire a Candidate</h5>
                <form className='contactUs mt-3' ref={form} onSubmit={sendEmail}>
                    <div className="mb-3">
                        <label htmlFor="nameContact" className="form-label">Name</label>
                        <input id="nameContact" className="form-control" placeholder='Your name' name="from_name" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emailContact" className="form-label">Company e-mail</label>
                        <input id="emailContact" type="email" className="form-control" placeholder='company@example.com' name="from_email" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="messageContact" className="form-label">Message</label>
                        <textarea id="messageContact" name="message" className="form-control" placeholder='Type your message here' required />
                    </div><hr />
                    <center>
                        <input type="submit" className="btn btn-info w-100" id="sendMail" value="Send" required />
                    </center>
                </form>
            </div>
        </>
    );
}

export default HireMail