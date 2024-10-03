import Background from './Background';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import Loader from './Loader';

function UpdateCndData(props) {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [candidateId, setCandidateId] = useState(null); // To store candidate ID from localStorage

    const [values, setValues] = useState({
        name: '',
        email: '',
        contact: '',
        password: ''
    });

    // Fetch candidate data by ID when the component is mounted
    const fetchCandidateData = async (id) => {
        try {
            setLoading(true);
            const response = await axios.get(`http://localhost:5000/viewCandidateProfile?candidate=${id}`);
            setValues(response.data);  // Populate the form with candidate data
            setLoading(false);
        } catch (error) {
            setLoading(false);
            console.error('Error fetching candidate data:', error);
        }
    };

    useEffect(() => {
        // Get candidate ID from localStorage
        const loggedInUserId = localStorage.getItem('candidate'); // Assuming 'candidate' is the key used to store candidate ID
        if (loggedInUserId) {
            const candidateIdFromStorage = loggedInUserId.slice(1, -1); // Remove quotes from stored string
            setCandidateId(candidateIdFromStorage);
            fetchCandidateData(candidateIdFromStorage); // Fetch candidate's existing data
        } else {
            console.error('No candidate ID found in localStorage');
        }
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setValues((prevData) => ({
            ...prevData,
            [name]: value
        }));
    };

    const handleUpdate = () => {
        if (!candidateId) {
            Swal.fire('Error', 'Candidate ID is missing. Unable to update.', 'error');
            return;
        }

        Swal.fire({
            title: 'Are you sure?',
            text: 'Update the data',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: "Yes",
            cancelButtonText: "Cancel"
        }).then((result) => {
            if (result.isConfirmed) {
                setLoading(true);
                axios.put(`http://localhost:5000/updateCandidate/${candidateId}`, values)
                    .then(response => {
                        Swal.fire('Updated', 'Data has been updated successfully', 'success');
                        setLoading(false);
                        navigate('/candidateDashboard');
                    })
                    .catch(error => {
                        setLoading(false);
                        console.error('Error updating candidate!', error);
                    });
            }
        });
    };

    if (loading) {
        return <Loader />;
    }

    return (
        <>
            {Background()}
            <div className="container" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? '#343a40' : 'white' }}>
                <form name='updateData'>
                    <div className="mb-3">
                        <h3 className='text-center'> Update Data </h3>
                        <label htmlFor="email" className="form-label">Email</label>
                        <input name="email" onChange={handleChange} value={values.email} type="email" className="form-control" autoComplete='off' id="email" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="name" className="form-label">Name</label>
                        <input name="name" onChange={handleChange} value={values.name} type="text" className="form-control" id="name" autoComplete='off' />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="mobile" className="form-label">Contact Number</label>
                        <input name="contact" onChange={handleChange} value={values.contact} type="tel" className="form-control" id="mobile" />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">Password</label>
                        <input name="password" onChange={handleChange} type="password" className="form-control" id="password" />
                    </div>
                    <hr />
                    <center>
                        <button onClick={(e) => { e.preventDefault(); handleUpdate(); }} type="submit" className="btn btn-warning mb-3 w-100" id="register">Update</button>
                        <Link to="/candidateDashboard">
                            <button type="button" className="btn btn-info w-100" id="back">Back</button>
                        </Link>
                    </center>
                </form>
            </div>
        </>
    );
}

export default UpdateCndData;
