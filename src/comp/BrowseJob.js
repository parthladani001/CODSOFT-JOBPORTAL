import React from 'react'
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
function BrowseJob(props) {

    const [data, setData] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch job data from API  
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:5000/viewJobData');
                setData(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, []);

    // Filter data based on search term
    const filteredData = data.filter((item) =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.company_name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <>
            <div className='position-relative' style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                <div className='aboutClass'>
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h2>Browse Job</h2>
                        <form className="form-inline" >
                            <input
                                className="form-control mr-sm-2"
                                type="search"
                                style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}
                                placeholder="Search Jobs"
                                aria-label="Search"
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </form>
                    </div>
                    <div className="row">
                        {filteredData.map((item) => (
                            <div className="col-md-4 col-sm-6 mb-4" key={item._id}>
                                <div className="card" style={{ backgroundColor: props.mode === 'light' ? 'white' : '#343a40', color: props.mode === 'light' ? 'black' : 'white' }}>
                                    <div className="card-header">
                                        <h3>{item.title}</h3>
                                    </div>
                                    <div className="card-body">
                                        <h5 className="card-title">{item.company_name}</h5><hr />
                                        <p className="card-text">Requirements: {item.requirements}</p>
                                        <center>
                                            <Link to="/login" className="btn w-75 btn-primary">Apply</Link>
                                        </center>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}

export default BrowseJob
