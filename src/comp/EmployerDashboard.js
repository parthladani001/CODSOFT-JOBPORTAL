import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useNavigate } from 'react-router-dom';

const EmployerDashboard = (props) => {
    const [jobs, setJobs] = useState([]);
    const [candidates, setCandidates] = useState([]);
    const navigate = useNavigate();
    const [newJob, setNewJob] = useState({
        title: '', company_name: '', company_email: '', description: '', requirements: ''
    });

    const loggedInUserId = localStorage.getItem('employer'); // Stored object ID

    // Check if loggedInUserId exists and is valid
    if (!loggedInUserId) {
        console.error("Employer ID is missing.");
    }

    // Remove double quotes from both sides of the Object ID (if necessary)
    const loggedInId = loggedInUserId.slice(1, -1);

    useEffect(() => {
        // Ensure the loggedInId is valid before making the API call
        if (loggedInId && loggedInId.length === 24) {
            axios.get(`http://localhost:5000/jobPosts?employer=${loggedInId}`)
                .then(response => {
                    setJobs(response.data);
                })
                .catch(error => console.log(error));
        } else {
            console.error('Invalid or missing employer ID');
        }
    }, [loggedInId]);

    // Fetch candidates who applied for jobs posted by the employer
    useEffect(() => {
        if (loggedInId && loggedInId.length === 24) {
            axios.get(`http://localhost:5000/candidates?employer=${loggedInId}`)
                .then(response => {
                    setCandidates(response.data);
                })
                .catch(error => console.log(error));
        }
    }, [loggedInId]);

    // Post new job and update the job list
    const postJob = (e) => {
        e.preventDefault();

        if (!loggedInId || loggedInId.length !== 24) {
            console.error('Invalid employer ID');
        } else {
            // Include the employer's ID when posting a new job
            axios.post('http://localhost:5000/jobPost', { ...newJob, employer: loggedInId })
                .then(response => {
                    // Add the newly posted job to the job list if it belongs to the logged-in employer
                    if (response.data.employer === loggedInId) {
                        setJobs([...jobs, response.data]);
                    }
                    // Reset the form fields after posting
                    setNewJob({ title: '', company_name: '', company_email: '', description: '', requirements: '' });
                })
                .catch(error => console.log(error));
        }
    };

    const handleDownload = (applicationId) => {

        axios.get(`http://localhost:5000/${applicationId}`, { responseType: 'blob' })
            .then(response => {
                if (response.status === 200) {
                    const blob = new Blob([response.data], { type: 'application/pdf' });
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = 'resume.pdf';
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    console.log('File not found.');
                }
            })
            .catch(error => {
                if (error.response && error.response.status === 404) {
                    console.log('Error 404: File not found');
                } else {
                    console.log('Other error:', error.message);
                }
            });
    };

    const handleDelete = async (id) => {
        Swal.fire({
            title: 'Are you sure?',
            text: "Do you want to delete this job post? This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                axios.delete(`http://localhost:5000/deleteJobPost/${id}`)
                    .then(() => {
                        setJobs(jobs.filter(job => job._id !== id));
                        Swal.fire('Deleted!', 'Job post has been deleted.', 'success');
                    })
                    .catch(error => {
                        console.error('Error deleting job:', error);
                        Swal.fire('Error!', 'There was an error deleting the job post.', 'error');
                    });
            }
        });
    };

    const handleHire = (candidateId) => {
        navigate('/hireMail', { state: { candidateId } });
    };

    const handleReject = (candidateId) => {
        Swal.fire({
            title: 'Reject Application?',
            text: "Do you want to reject this candidate's application? This action cannot be undone.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, Reject!'
        }).then((result) => {
            if (result.isConfirmed) {
                // Using candidate_id for deletion
                axios.delete(`http://localhost:5000/deleteCandidate/${candidateId}`)
                    .then(() => {
                        setCandidates(candidates.filter(candidate => candidate.candidate_id !== candidateId));
                        Swal.fire('Rejected!', 'The application has been rejected.', 'success');
                    })
                    .catch(error => {
                        console.error('Error rejecting application:', error);
                        Swal.fire('Error!', 'There was an error rejecting the application.', 'error');
                    });
            }
        });
    };



    return (
        <>
            <div className='position-relative' style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                <div className='aboutClass'>
                    <h2 className='mb-3'>Employer Dashboard</h2>
                    <h4 className='text-primary'>
                        <strong>Your Job Postings</strong>
                    </h4>

                    <div className="row">
                        {jobs.map(job => (
                            <div className="col-md-4 mb-4" key={job._id}>
                                <div className="card h-100" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                                    <div className="card-body">
                                        <h5 className="card-title text-primary">{job.title}</h5>
                                        <p className="card-text text-info"><strong>{job.company_name}</strong></p>
                                        <p className="card-text"><strong>Description: </strong>{job.description}</p>
                                        <p className="card-text"><strong>Requirements: </strong>{job.requirements}</p>
                                    </div>
                                    <div className='card-footer'>
                                        <button className='mt-3 w-50 btn btn-danger' onClick={() => handleDelete(job._id)}>Delete Post</button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <h4 className='text-primary'>
                        Post a new Job
                    </h4>
                    <form className="job-form w-50" onSubmit={postJob}>
                        <div className="form-group mb-3">
                            <label htmlFor="jobTitle">Job Title</label>
                            <input type="text" className="form-control" id="jobTitle" value={newJob.title}
                                onChange={(e) => setNewJob({ ...newJob, title: e.target.value })} placeholder="Enter Job Title" required />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="companyName">Company Name</label>
                            <input type="text" className="form-control"
                                id="companyName" value={newJob.company_name} onChange={(e) => setNewJob({ ...newJob, company_name: e.target.value })} placeholder="Enter Company Name" required />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="companyEmail">Company Email</label>
                            <input type="email" className="form-control"
                                id="companyEmail" value={newJob.company_email} onChange={(e) => setNewJob({ ...newJob, company_email: e.target.value })} placeholder="Enter Company Email" required />
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="jobDescription">Job Description</label>
                            <textarea className="form-control" id="jobDescription"
                                value={newJob.description} maxLength="1000" onChange={(e) => setNewJob({ ...newJob, description: e.target.value })} placeholder="Describe the Job" required></textarea>
                        </div>
                        <div className="form-group mb-3">
                            <label htmlFor="jobRequirements">Job Requirements</label>
                            <textarea className="form-control" id="jobRequirements" value={newJob.requirements} maxLength="500" onChange={(e) => setNewJob({ ...newJob, requirements: e.target.value })} placeholder="List Job Requirements" required></textarea>
                        </div>
                        <button type="submit" className="btn btn-primary w-25 mb-3">Post Job</button>
                    </form>

                    <h4 className='text-primary mt-5'>
                        Candidates who Applied
                    </h4>
                    <div className="row">
                        {candidates.map(candidate => (
                            <div className="col-md-4 mb-4" key={candidate._id}>
                                <div className="card h-100" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                                    <div className="card-body">
                                        <h5 className="card-title text-primary">{candidate.name}</h5>
                                        <p className="card-text">Email: {candidate.email}</p>
                                        <p className="card-text">Contact: {candidate.contact}</p>
                                        <p className="card-text">Applied For: {candidate.applied_for}</p>
                                    </div>
                                    <div className="card-footer">
                                        {candidate.resume_url ? (
                                            <button
                                                onClick={() => handleDownload(candidate.resume_url)}
                                                className="btn m-2 btn-primary"
                                            >
                                                Download Resume
                                            </button>
                                        ) : (
                                            <span className="text-muted">Resume not available</span>
                                        )}
                                        <button
                                            onClick={() => handleHire(candidate.candidate_id)}
                                            className="btn m-2 btn-success"
                                        >
                                            Hire
                                        </button>
                                        <button
                                            onClick={() => handleReject(candidate.candidate_id)}
                                            className="btn m-2 btn-danger"
                                        >
                                            Reject Application
                                        </button>
                                    </div>


                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmployerDashboard;
