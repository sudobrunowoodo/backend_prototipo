const express = require('express');
const jobsControllers = require('./jobs.controller');
const router = express.Router();

router.get('/jobs', jobsControllers.getAllJobsController);

module.exports = router;