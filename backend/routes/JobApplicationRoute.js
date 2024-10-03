const express = require('express');
const multer = require('multer');
const JobApplication = require('../models/JobApplication');
const Jobs = require('../models/Jobs');
const router = express.Router();

// Set up multer for file handling
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Route for applying for a job
router.post('/applyForJob', upload.single('resume'), async (req, res) => {
    try {
        const { name, email, contact, job_id, employer_id, candidate_id } = req.body;
        const resume = req.file.buffer;

        const newApplication = new JobApplication({
            name,
            email,
            contact,
            job_id,
            employer_id,
            candidate_id,
            resume
        });

        await newApplication.save();
        res.status(200).json({ message: 'Application submitted successfully!' });
    } catch (error) {
        console.error('Error submitting application:', error);
        res.status(500).json({ message: 'Failed to submit application' });
    }
});

// API for fetching candidates who applied to jobs posted by a specific employer
router.get('/candidates', async (req, res) => {
    try {
        const employerId = req.query.employer; // Get employer ID from the query params

        if (!employerId) {
            return res.status(400).json({ message: "Employer ID is required" });
        }

        // Find all job applications where the employer_id matches the employer
        const jobApplications = await JobApplication.find({ employer_id: employerId });

        if (jobApplications.length === 0) {
            return res.status(404).json({ message: "No candidates found for this employer" });
        }

        // For each job application, fetch the corresponding job details
        const candidates = await Promise.all(
            jobApplications.map(async (application) => {
                // Fetch the job details using the job_id from the application
                const job = await Jobs.findById(application.job_id);
                if (job) {
                    return {
                        candidate_id: application.candidate_id,
                        name: application.name,
                        email: application.email,
                        contact: application.contact,
                        job_id: application.job_id,
                        applied_for: job.title, // Fetching 'applied_for' from the job's title
                        date_applied: application.date,
                        resume_url: `/resume/${application._id}`
                    };
                } else {
                    return null;
                }
            })
        );

        // Filter out any null values in case any job_id doesn't match a job
        const filteredCandidates = candidates.filter(candidate => candidate !== null);

        res.status(200).json(filteredCandidates);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/resume/:applicationId', async (req, res) => {
    try {
        const applicationId = req.params.applicationId;
        const application = await JobApplication.findById(applicationId);

        if (!application || !application.resume) {
            return res.status(404).json({ message: "Resume not found" });
        }

        const resumeBuffer = Buffer.from(application.resume, 'base64');

        res.setHeader('Content-Disposition', 'attachment; filename=resume.pdf');
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Length', resumeBuffer.length);
        res.send(resumeBuffer);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

router.get('/viewJobApplication/:candidateId', async (req, res) => {
    try {
        const candidateId = req.params.candidateId;

        // Get pagination details from query params
        const page = parseInt(req.query.page) || 1; // Default page 1
        const limit = parseInt(req.query.limit) || 10; // Default limit 10

        // Fetch job applications with pagination
        const jobApplications = await JobApplication.find({ candidate_id: candidateId })
            .select('job_id status appliedDate') // Select only necessary fields
            .skip((page - 1) * limit) // Skip the number of records for the page
            .limit(limit); // Limit the number of records returned

        // If no job applications found, return empty array
        if (!jobApplications.length) {
            return res.status(200).json([]);
        }

        // For each application, fetch the corresponding job details
        const applicationsWithJobDetails = await Promise.all(
            jobApplications.map(async (application) => {
                const jobDetails = await Jobs.findById(application.job_id)
                    .select('title company_name requirements'); // Fetch only necessary job fields

                return {
                    ...application.toObject(), // Convert application Mongoose document to plain object
                    jobDetails, // Append job details to the application
                };
            })
        );

        // Return the combined data (job applications + job details)
        res.status(200).json({
            page,
            limit,
            totalApplications: await JobApplication.countDocuments({ candidate_id: candidateId }), // Total applications for pagination
            applications: applicationsWithJobDetails,
        });
    } catch (error) {
        console.error('Error fetching job applications or jobs:', error);
        res.status(500).json({ message: 'Failed to fetch data' });
    }
});

// DELETE request to remove a candidate's application by candidate_id
router.delete('/deleteCandidate/:id', async (req, res) => {
    const candidateId = req.params.id;
    const deleteCandidateId = req.params.id;

    try {
        // Find and delete the candidate application using candidate_id
        const result = await JobApplication.findOneAndDelete({ candidate_id: deleteCandidateId });

        if (!result) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        res.status(200).json({ message: 'Candidate application deleted successfully' });
    } catch (error) {
        console.error('Error deleting candidate:', error);
        res.status(500).json({ message: 'An error occurred while deleting the candidate' });
    }
});

module.exports = router;
