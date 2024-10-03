const Jobs = require('../models/Jobs');
const Employer = require('../models/Employer');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

// API for posting a job
router.post('/jobPost', async (req, res) => {
    try {
        const { title, company_name, company_email, description, requirements, employer } = req.body;
        // Ensure that the employer is cast to a valid ObjectId
        const employerId = mongoose.Types.ObjectId.isValid(employer) ? new mongoose.Types.ObjectId(employer) : null;

        if (!employerId) {
            return res.status(400).json({ message: 'Invalid Employer ID' });
        }
        // Create a new job data
        const newJob = new Jobs({
            title,
            company_name,
            company_email,
            description,
            requirements,
            employer: employerId
        });

        // Save the job to the database
        const savedJob = await newJob.save();
        res.status(201).json(savedJob);

    } catch (err) {
        console.error('Error details:', err); // Log the exact error
        res.status(500).json('Internal Server Error');
    }
});

// API for fetching Job data
router.get('/viewJobData', async (req, res) => {
    try {
        const allJobData = await Jobs.find({})
        res.send(allJobData)
    } catch (err) {
        console.log(err)
    }
});
module.exports = router;

// Getting job for a specific ID
router.get('/viewJobData/:id', async (req, res) => {
    try {
        const jobId = req.params.id;  // Get the job ID from the request parameters
        const jobData = await Jobs.findById(jobId);  // Search the job by its ID

        if (!jobData) {
            return res.status(404).send({ message: 'Job not found' });
        }

        res.send(jobData);
    } catch (err) {
        console.log(err);
        res.status(500).send({ message: 'Server error' });
    }
});
module.exports = router;

// API for getting all job posts by a specific employer
router.get('/jobPosts', async (req, res) => {
    try {
        const { employer } = req.query;  // Get the employer ID from the query params

        // Ensure that the employer ID is provided
        if (!employer) {
            return res.status(400).json({ message: 'Employer ID is required' });
        }

        // Ensure that the employer ID is valid
        if (!mongoose.Types.ObjectId.isValid(employer)) {
            return res.status(400).json({ message: 'Invalid Employer ID' });
        }

        // Find jobs where the employer matches the logged-in employer's ID
        const jobs = await Jobs.find({ employer: employer });

        // If no jobs are found, return a specific message
        if (jobs.length === 0) {
            return res.status(404).json({ message: 'No jobs found for this employer' });
        }

        res.status(200).json(jobs);
    } catch (err) {
        console.error('Error fetching jobs:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// API to fetch employer ID by Job ID
router.get('/getEmployerId/:jobId', async (req, res) => {
    const { jobId } = req.params;

    try {
        // Find the job by jobId
        const job = await Jobs.findById(jobId);

        if (!job) {
            return res.status(404).send({ message: 'Job not found' });
        }
        // Get the employerId from the job document
        const employerId = job.employer;
        res.status(200).send({ employerId });
    } catch (error) {
        console.error('Error fetching employer ID:', error);
        res.status(500).send({ message: 'Failed to fetch employer ID' });
    }
});

// API for deleting jobPost by ID
router.delete('/deleteJobPost/:id', async (req, res) => {
    try {
        const { id } = req.params;  // Extracting id from params

        // Finding and deleting the job post by _id
        const result = await Jobs.findOneAndDelete({ _id: id });

        if (result) {
            res.status(200).send({ message: 'Job post deleted successfully' });
        } else {
            res.status(404).send({ message: 'Job post not found' });
        }
    } catch (err) {
        console.error('Error deleting job post:', err);  // Log the error
        res.status(500).send({ message: 'Internal server error' });
    }
});

//DUMMY
// API for count total Employer entries in database
router.get('/employerEntryCount', async (req, res) => {
    try {
        const count = await Employer.countDocuments();
        res.json({ count });
    } catch (error) {
        res.status(500).json({ error: 'An error occurred' });
    }
});

module.exports = router;