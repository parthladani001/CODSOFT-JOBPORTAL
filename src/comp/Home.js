import React from 'react'
import { Link } from 'react-router-dom'
import image1 from '../images/joinUs.png'
import image2 from '../images/leader.png'
import image3 from '../images/conversation.png'
import image4 from '../images/website.png'
import image5 from '../images/app.png'
import image6 from '../images/apple.png'
function Home(props) {
    return (
        <>
            <div style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', marginTop: 100, color: props.mode === 'light' ? 'black' : 'white' }}>

                <header className="hero my-3 d-flex flex-column justify-content-center align-items-center text-center">
                    <h1 className='text-primary'>Welcome to Jobify</h1>
                    <h1>Find your Dream Job</h1>
                    <p>Get a fast job & grow your network</p>
                </header>

                <div className='text-center m-3'>
                    <Link className="btn btn-info" to="/login">Find a Job</Link>
                </div>
                <h2 className='ms-4'>Why Jobify?</h2>

                <div className="mx-3 justify-content-evenly row">
                    <div className="card p-2" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                        <img className="card-img-top" src={image1} alt="img" />
                        <h3 className='mt-5'>Join Us</h3>
                        <p>Hire a Skilled Candidate or Join a Growing Company</p>
                    </div>
                    <div className="card p-2" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                        <img className="card-img-top" src={image2} alt="img" />
                        <h3>Stay Updated</h3>
                        <p>Companies requirements are most demandful</p>
                    </div>
                    <div className="card p-2" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                        <img className="card-img-top" src={image3} alt="img" />
                        <h3 className='mt-5'>Easy Apply</h3>
                        <p>Apply for your Dream Job & grab an Opportunity</p>
                    </div>
                    <hr />
                    <h2 className='ms-4'>Latest Jobs for you</h2>
                    <div className="card p-2" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                        <img className="card-img-top" src={image4} alt="img" />
                        <h3 className='mt-5'>Web Development</h3>
                        <p>Apply for your Dream Job for your carrier in Website Development</p>
                    </div>
                    <div className="card p-2" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                        <img className="card-img-top" src={image5} alt="img" />
                        <h3 className='mt-5'>App Development</h3>
                        <p>Apply for your Dream Job for your carrier in Application Development</p>
                    </div>
                    <div className="card p-2" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                        <img className="card-img-top" src={image6} alt="img" />
                        <h3 className='mt-5'>IOS Development</h3>
                        <p>Apply for your Dream Job for your carrier in IOS Development</p>
                    </div>
                </div>

                <footer className="d-flex flex-column justify-content-center align-items-center py-3" style={{ backgroundColor: props.mode === 'light' ? '#dedede' : '#545454', color: props.mode === 'light' ? 'black' : 'white' }}>
                    <p>&copy; 2024 Jobify. All Rights Reserved.</p>
                </footer>
            </div>
        </>
    )
}

export default Home