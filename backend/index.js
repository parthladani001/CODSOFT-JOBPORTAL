const connectMongo = require("./db");
const express = require('express');
const cors = require('cors');
const candidateRouter = require('./routes/CandidateRoute');
const employerRouter = require('./routes/EmployerRoute');
const jobRouter = require('./routes/JobRoute');
const jobApplicationRouter = require('./routes/JobApplicationRoute');
const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());
connectMongo();

// Available APIs
app.use('', candidateRouter);
app.use('', employerRouter);
app.use('', jobRouter);
app.use('', jobApplicationRouter);

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})