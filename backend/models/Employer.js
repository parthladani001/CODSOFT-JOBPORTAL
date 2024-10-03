const mongoose = require('mongoose');

const employerSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    contact: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    key: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
});

const Employer = mongoose.model('Employer', employerSchema);

module.exports = Employer;
