import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import axios from 'axios';
import Background from './Background';

const ViewJobDetails = (props) => {
    // Fetch jobId from localStorage
    const jobId = localStorage.getItem('jobId');
    const [job, setJob] = useState(null);
    const [, setError] = useState('');
    const [, setEmployerId] = useState('');

    // Fetch job details based on jobId
    useEffect(() => {
        const fetchJobDetails = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/viewJobData/${jobId}`);
                setJob(response.data);
            } catch (error) {
                console.error('Error fetching job details:', error);
                setError('Failed to fetch job details');
            }
        };

        if (jobId) {
            fetchJobDetails();
        }
    }, [jobId]);

    // Fetch employerId based on jobId and store it in localStorage
    useEffect(() => {
        const fetchEmployerId = async () => {
            try {
                const response = await axios.get(`http://localhost:5000/getEmployerId/${jobId}`);
                const fetchedEmployerId = response.data.employerId;

                setEmployerId(fetchedEmployerId);  // Update state with employerId
                localStorage.setItem('employerId', fetchedEmployerId);  // Store in localStorage
            } catch (error) {
                console.error('Error fetching employer ID:', error);
                setError('Failed to fetch employer ID');
            }
        };

        if (jobId) {
            fetchEmployerId();
        }
    }, [jobId]);

    return (
        <>
            {Background()}
            <div
                className="d-flex justify-content-center align-items-center vh-100"
                style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}
            >
                <div className="row w-100 justify-content-center">
                    {job ? (
                        <div className="col-12 col-md-10 col-lg-8">
                            <div className="card shadow-lg mb-5"
                                style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}
                            >
                                <div className="card-header bg-primary text-white">
                                    <h3 className="card-title mb-0 text-center">{job.title}</h3>
                                </div>
                                <div className="card-body">
                                    <h5 className="card-subtitle mb-2 text-center">{job.company_name}</h5>
                                    <hr />
                                    <p className="card-text">
                                        <strong>Description:</strong> {job.description}
                                    </p>
                                    <p className="card-text">
                                        <strong>Requirements:</strong> {job.requirements}
                                    </p>
                                    <p className="card-text">
                                        <strong>E-mail:</strong> {job.company_email}
                                    </p>
                                    <div className="d-grid">
                                        <Link className="btn btn-success btn-md" to="/jobApplication">Apply Now</Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="col-12">
                            <div className="alert alert-warning text-center">
                                No job details available.
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};

export default ViewJobDetails;
