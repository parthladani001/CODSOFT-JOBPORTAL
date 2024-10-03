const Candidate = require('../models/Candidate');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');

// API for creating/registering candidate
router.post('/candidateReg', async (req, res) => {
    try {
        const { name, email, contact, password, key } = req.body;

        // Hash the password ans secrey key
        const saltPass = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltPass);
        const saltKey = await bcrypt.genSalt(5);
        const hashedKey = await bcrypt.hash(key, saltKey);

        // Create a new Candidate
        const newCandidate = new Candidate({
            name: name,
            email: email,
            contact: contact,
            password: hashedPassword,
            key: hashedKey
        });

        // Save the Candidate to the database
        await newCandidate.save();
        res.status(201).send('User registered');

    } catch (err) {
        res.status(500).send('Internal Server error');
    }
});

// API for login of Candidate
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the Candidate by email
        const candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(400).send('Invalid email or password');
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, candidate.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }
        res.send(candidate).status(200);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// API for getting all data by a specific candidate
router.get('/viewCandidateProfile', async (req, res) => {
    try {
        const { candidate } = req.query;  // Get the candidate ID from the query params

        // Ensure that the candidate ID is provided
        if (!candidate) {
            return res.status(400).json({ message: 'candidate ID is required' });
        }

        // Ensure that the candidate ID is valid
        if (!mongoose.Types.ObjectId.isValid(candidate)) {
            return res.status(400).json({ message: 'Invalid candidate ID' });
        }

        // Find profile by candidate ID (assuming 'candidate' refers to the _id field)
        const profile = await Candidate.findOne({ _id: candidate });

        // If no profile is found, return a specific message
        if (!profile) {
            return res.status(404).json({ message: 'No data found for this candidate' });
        }

        res.status(200).json(profile);
    } catch (err) {
        console.error('Error fetching profile:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});


// API for changing password of Candidate
router.post('/changePass', async (req, res) => {
    try {
        const { email, password, key } = req.body;

        // Find the user by email
        const candidate = await Candidate.findOne({ email });
        if (!candidate) {
            return res.status(400).send('Invalid email');
        }

        // Compare the key
        const isKeyMatch = await bcrypt.compare(key, candidate.key);
        if (!isKeyMatch) {
            return res.status(400).send('Key not matched');
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(password, salt);

        // Update the password
        candidate.password = newHashedPassword;
        await candidate.save();
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// Update candidate profile by ObjectId
router.put('/updateCandidate/:id', async (req, res) => {
    const { id } = req.params;
    const { name, contact, email, password } = req.body;

    try {
        // Ensure all required fields are provided
        if (!name || !contact || !email) {
            return res.status(400).json({ message: 'Name, contact, and email are required' });
        }

        // Find the candidate by ObjectId
        const candidate = await Candidate.findById(id);
        if (!candidate) {
            return res.status(404).json({ message: 'Candidate not found' });
        }

        // Hash the new password if provided
        const updateFields = { name, contact, email };
        if (password) {
            updateFields.password = await bcrypt.hash(password, 10);
        }

        // Update the candidate profile
        const updatedCandidate = await Candidate.findByIdAndUpdate(
            id,
            updateFields,
            { new: true, runValidators: true }
        );

        res.status(200).json({ message: 'Candidate updated successfully', updatedCandidate });
    } catch (err) {
        console.error('Error updating candidate profile:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// API for deleting candidate by ID
router.delete('/deleteCndAcc/:id', async (req, res) => {
    const candidateId = req.params.id;

    try {
        const deletedCandidate = await Candidate.findByIdAndDelete(candidateId);

        if (deletedCandidate) {
            return res.status(200).json({ message: 'Deleted successfully.' });
        } else {
            return res.status(404).json({ message: 'Data not found.' });
        }
    } catch (error) {
        return res.status(500).json({ message: 'An error occurred while deleting the candidate.', error });
    }
});


module.exports = router;