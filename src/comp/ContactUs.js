import React, { useRef, useState } from 'react';
import emailjs from '@emailjs/browser';
import whatsappIcon from '../icons/whatsappIcon.png'
import emailIcon from '../icons/gmailIcon.png'
import linkedIcon from '../icons/linkedinIcon.png'
import Swal from 'sweetalert2';
import contactUsLogo from '../images/contactUsLogo.png'
import Background from './Background';
import Loader from './Loader';
import { Link } from 'react-router-dom';

function ContactUs(props) {
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
                    Swal.fire('Sent !', "We'll reach you through e-mail", 'success')
                },
                (error) => {
                    setLoading(false);
                    console.log(error);
                    Swal.fire('Error !', 'Something went wrong', 'error')
                },

            );
    }

    function handleWhatsappIcon() {
        const phoneNumber = 'YOUR_CONTACT_NUMBER';

        // Check if the user is on a mobile device
        const isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

        // Construct the WhatsApp URL
        const whatsappUrl = isMobileDevice
        ? `https://wa.me/${phoneNumber}`
        : `https://web.whatsapp.com/send?phone=${phoneNumber}`;

        // Open whatsapp
        window.open(whatsappUrl, '_blank', 'noopener noreferrer');
    }

    // Set loading
    if(loading) {
        return <Loader />
    }
    
    return (
        <>
            {Background()}
            <div className="container" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                <h3><img className="me-2 mb-2" src={contactUsLogo} alt="Logo" height="40" width="40" />Contact Us </h3>

                <div className='mb-3 text-center'>
                    <img src={whatsappIcon} style={{ cursor: 'pointer' }} alt="WhatsApp" onClick={handleWhatsappIcon} height="60" width="60"/>
                    <Link to="mailto:YOUR_EMAIL_ID" className='m-4'>
                        <img src={emailIcon} style={{ cursor: 'pointer' }} alt="Email" height="50" width="50" />
                    </Link>
                    <Link target='blank' to="YOUR_LINKEDIN_PROFILE">
                        <img src={linkedIcon} style={{ cursor: 'pointer' }} alt="LinkedIn" height="60" width="60" />
                    </Link>
                </div>

                <h5>Please provide your details below to get in touch with us</h5>
                <form className='contactUs mt-3' ref={form} onSubmit={sendEmail}>
                    <div className="mb-3">
                        <label htmlFor="nameContact" className="form-label">Name</label>
                        <input id="nameContact" className="form-control" placeholder='Your name' name="from_name" required />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="emailContact" className="form-label">e-mail</label>
                        <input id="emailContact" type="email" className="form-control" placeholder='Your e-mail' name="from_email" required />
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

export default ContactUs