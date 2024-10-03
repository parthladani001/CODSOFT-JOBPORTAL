const Employer = require('../models/Employer');
const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');

// API for creating/registering Employer
router.post('/employerReg', async (req, res) => {
    try {
        const { name, email, contact, password, key } = req.body;

        // Hash the password ans secrey key
        const saltPass = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, saltPass);
        const saltKey = await bcrypt.genSalt(5);
        const hashedKey = await bcrypt.hash(key, saltKey);

        // Create a new Employer
        const newEmployer = new Employer({
            name: name,
            email: email,
            contact: contact,
            password: hashedPassword,
            key: hashedKey
        });

        // Save the Employer to the database
        await newEmployer.save();
        res.status(201).send('User registered');

    } catch (err) {
        res.status(500).send('Internal Server error');
    }
});

// API for login of Employer
router.post('/employerLogin', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find the Employer by email
        const employer = await Employer.findOne({ email });
        if (!employer) {
            return res.status(400).send('Invalid email or password');
        }

        // Compare the password
        const isMatch = await bcrypt.compare(password, employer.password);
        if (!isMatch) {
            return res.status(400).send('Invalid email or password');
        }
        res.send(employer).status(200);
    } catch (err) {
        res.status(500).send('Server error');
    }
});

// API for changing password of Employer
router.post('/changeEmpPass', async (req, res) => {
    try {
        const { email, password, key } = req.body;

        // Find the user by email
        const employer = await Employer.findOne({ email });
        if (!employer) {
            return res.status(400).send('Invalid email');
        }

        // Compare the key
        const isKeyMatch = await bcrypt.compare(key, employer.key);
        if (!isKeyMatch) {
            return res.status(400).send('Key not matched');
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);
        const newHashedPassword = await bcrypt.hash(password, salt);

        // Update the password
        employer.password = newHashedPassword;
        await employer.save();
        res.json({ success: true })
    } catch (err) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
});

// API for update Employer data by email as ID
router.put('/updateEmployerData/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const updatedEmployer = await Employer.findOneAndUpdate(
            { email: email },
            req.body,
            { new: true }
        );

        if (!updatedEmployer) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.json(updatedEmployer);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// API for deleting Employer by email as ID
router.delete('/deleteEmployerData/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const result = await Employer.findOneAndDelete({ email: email });
        if (result) {
            res.status(200).send({ message: 'Data deleted successfully' });
        } else {
            res.status(404).send({ message: 'Data not found' });
        }
    } catch (err) {
        res.status(500).send('Internal server error');
    }
});

// API for fetching Employer data
router.get('/viewEmployerData', async (req, res) => {
    try {
        const allEmployerData = await Employer.find({})
        res.send({ data: allEmployerData })
    } catch (err) {
        console.log(err)
    }
});

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