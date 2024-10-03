import React, { useState } from 'react';
import axios from 'axios';
import Background from './Background';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const JobApplication = (props) => {
    const [error, setError] = useState('');
    const [formData, setFormData] = useState({ name: '', email: '', contact: '', resume: null });
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const jobId = localStorage.getItem('jobId');  // Get jobId from localStorage
    const employerId = localStorage.getItem('employerId');  // Get employerId from localStorage
    const candidateId = localStorage.getItem('candidate');  // Get candidateId from localStorage

    const handleSubmit = (e) => {
        e.preventDefault();
        const data = new FormData();
        data.append('name', formData.name);
        data.append('email', formData.email);
        data.append('contact', formData.contact);
        data.append('resume', formData.resume);
        data.append('job_id', jobId);
        data.append('employer_id', employerId);
        data.append('candidate_id', candidateId.slice(1, -1));

        setLoading(true);

        axios.post('http://localhost:5000/applyForJob', data)
            .then(response => {
                Swal.fire("Success", "Your application has been submitted successfully", "success")
                    .then(() => {
                        setFormData({ name: '', email: '', contact: '', resume: null }); // Clear form data
                        navigate('/candidateDashboard');
                    });
                setLoading(false);
            })
            .catch(error => {
                console.log(error);
                setError('Failed to submit application');
                setLoading(false);
            });
    };

    return (
        <>
            <Background />
            <div className="row mt-5 justify-content-center">
                <div className="col-md-6 mt-3">
                    <div className="card shadow" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                        <div className="card-header text-center bg-primary">
                            <h3>Apply for this Job</h3>
                        </div>
                        <div className="card-body">
                            {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
                            <form onSubmit={handleSubmit}>
                                <div className="form-group mb-3">
                                    <label htmlFor="name" className="form-label">Name</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="name"
                                        placeholder="Enter your name"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        maxLength="30"
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="email" className="form-label">Email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        id="email"
                                        placeholder="Enter your email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        maxLength="50"
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="contact" className="form-label">Contact</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        id="contact"
                                        placeholder="Enter your contact"
                                        value={formData.contact}
                                        onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                                        maxLength="10"
                                        required
                                    />
                                </div>
                                <div className="form-group mb-3">
                                    <label htmlFor="resume" className="form-label">Resume</label>
                                    <input
                                        type="file"
                                        className="form-control"
                                        id="resume"
                                        onChange={(e) => setFormData({ ...formData, resume: e.target.files[0] })}
                                        required
                                    />
                                </div>
                                <hr />
                                <button type="submit" className="btn btn-primary w-100" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit Application'}
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default JobApplication;
