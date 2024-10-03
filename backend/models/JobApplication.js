const mongoose = require('mongoose');
const { Binary } = mongoose.mongo; // For handling Binary data

const jobApplicationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    contact: {
        type: String,
        required: true
    },
    job_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Jobs'
    },
    employer_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Employer'
    },
    candidate_id: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Candidate'
    },
    resume: {
        type: Buffer,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const JobApplication = mongoose.model('JobApplication', jobApplicationSchema);

module.exports = JobApplication;
