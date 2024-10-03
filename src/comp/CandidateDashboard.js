import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const CandidateDashboard = (props) => {
    const [profile, setProfile] = useState({});
    const [applications, setApplications] = useState([]);
    const [data, setData] = useState([]); // Fetch job data separately
    const [page, setPage] = useState(1);  // For pagination
    const [totalApplications, setTotalApplications] = useState(0); // Track total applications
    // eslint-disable-next-line
    const [limit, setLimit] = useState(10);  // Number of applications per page

    const navigate = useNavigate();
    const loggedInUserId = localStorage.getItem('candidate'); // Stored object ID

    // Check if loggedInUserId exists and is valid
    if (!loggedInUserId) {
        console.error("Candidate ID is missing.");
    }

    // Remove double quotes from both sides of the Object ID (if necessary)
    const loggedInId = loggedInUserId.slice(1, -1);

    // Fetch Candidate Profile
    useEffect(() => {
        if (loggedInId && loggedInId.length === 24) {
            axios.get(`http://localhost:5000/viewCandidateProfile?candidate=${loggedInId}`)
                .then(response => {
                    setProfile(response.data);
                })
                .catch(error => console.log(error));
        } else {
            console.error('Invalid or missing candidate ID');
        }
    }, [loggedInId]);

    // Fetch job applications for the logged-in candidate
    useEffect(() => {
        const fetchJobApplications = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/viewJobApplication/${loggedInId}?page=${page}&limit=${limit}`);
                setApplications(response.data.applications);
                setTotalApplications(response.data.totalApplications); // Set the total number of applications
            } catch (error) {
                console.error('Error fetching job applications:', error);
            }
        };

        if (loggedInId) {
            fetchJobApplications();
        }
    }, [loggedInId, page, limit]);

    // Fetch job data separately from another API
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/viewJobData');
                setData(response.data); // Set the job data
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Function to handle the 'View Job Details' button click
    const handleViewJobDetails = (jobId) => {
        localStorage.setItem('jobId', jobId);
        navigate('/viewJobDetails');
    };

    // Pagination controls
    const handleNextPage = () => {
        if (page * limit < totalApplications) {
            setPage(page + 1);
        }
    };

    const handlePreviousPage = () => {
        if (page > 1) {
            setPage(page - 1);
        }
    };

    const handleDelete = () => {
        // Get the candidate ID from local storage
        const candidateId = localStorage.getItem("candidate");
        const deleteCandidateId = candidateId.slice(1, -1);
        if (!candidateId) {
            console.error("Candidate ID not found in local storage");
            return;
        }

        // Confirm the deletion action with SweetAlert2
        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, delete it!'
        }).then((result) => {
            if (result.isConfirmed) {
                // API call to delete the candidate by ID via the backend
                fetch(`http://localhost:5000/deleteCndAcc/${deleteCandidateId}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            Swal.fire(
                                'Deleted!',
                                'Your candidate has been deleted.',
                                'success'
                            ).then(() => {
                                // Navigate to home after successful deletion
                                window.location.href = "/";
                            });
                            localStorage.removeItem("candidate");
                        } else {
                            Swal.fire(
                                'Failed!',
                                'Failed to delete the candidate.',
                                'error'
                            );
                            console.error("Failed to delete the candidate:", response.statusText);
                        }
                    })
                    .catch(error => {
                        Swal.fire(
                            'Error!',
                            'An error occurred while deleting the candidate.',
                            'error'
                        );
                        console.error("An error occurred while deleting the candidate:", error);
                    });
            }
        });
    };

    return (
        <div className="mt-5" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
            <h1 className="mb-4 text-center" style={{ marginTop: 100 }}>Candidate Dashboard</h1>

            <div className="row mb-4 justify-content-center">
                {/* Profile Section */}
                <div className="col-md-5 mb-4">
                    <h2 className='ms-3'>Your Profile</h2>
                    <div className="card" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                        <div className="card-body">
                            <p className="card-text"><strong>Name:</strong> {profile.name || 'USER'}</p>
                            <p className="card-text"><strong>Email:</strong> {profile.email || 'NULL'}</p>
                            <p className="card-text"><strong>Contact:</strong> {profile.contact || 'NULL'}</p>
                            <p className="card-text text-danger"><strong>Password:</strong> {'Encrypted'}</p>
                            <Link className='btn btn-warning w-50' to="/updateCndData" role='button'>Update Data</Link>
                            <div className='btn btn-danger mt-3' onClick={handleDelete} role='button'>Delete Account</div>
                        </div>
                    </div>
                </div>

                {/* Applications Section */}
                <div className="col-md-5 mb-4">
                    <h2 className='ms-3'>Your Job Applications</h2>
                    <div className="card" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                        <div className="card-body" >
                            <ul className="list-group" >
                                {(applications?.length > 0) ? (
                                    applications.map(application => (
                                        <li className="list-group-item" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }} key={application._id}>
                                            <strong>{application.jobDetails.title}</strong> at {application.jobDetails.company_name}
                                            <button className="btn btn-link" onClick={() => handleViewJobDetails(application.job_id)}>View Details</button>
                                        </li>
                                    ))
                                ) : (
                                    <li className="list-group-item" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>No applications found.</li>
                                )}
                            </ul>

                        </div>
                    </div>

                    {/* Pagination Controls */}
                    <div className="mt-3">
                        <button className="btn btn-secondary me-2" onClick={handlePreviousPage} disabled={page === 1}>Previous</button>
                        <button className="btn btn-secondary" onClick={handleNextPage} disabled={page * limit >= totalApplications}>Next</button>
                    </div>

                    <hr />
                </div>

                {/* Jobs Section */}
                <div className="row">
                    {data.map((item) => (
                        <div className="col-md-4 col-sm-6 mb-4" key={item._id}>
                            <div className="card" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                                <div className="card-header">
                                    <h3>{item.title}</h3>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-title">{item.company_name}</h5><hr />
                                    <p className="card-text">Requirements: {item.requirements}</p>
                                    <center>
                                        <button
                                            className="btn w-75 btn-primary"
                                            onClick={() => handleViewJobDetails(item._id)} >
                                            View Job Details
                                        </button>
                                    </center>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CandidateDashboard;
