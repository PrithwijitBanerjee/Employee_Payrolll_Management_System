const JobMastService = require('../service/jobmast.service');
const { successResponse, errorResponse } = require('../utils/response');

exports.createJob = async (req, res) => {
  try {
    const jobData = req.body;
    const logedData = req.user;
    const createdJob = await JobMastService.createJob(jobData, logedData);
    return successResponse(res, 'Job created successfully', createdJob);
  } catch (error) {
    return errorResponse(res, 500, 'Failed to create job', error.message);
  }
};

exports.getAllJobs = async (req, res) => {
  try {
    const jobs = await JobMastService.getAllJobs();
    return successResponse(res, 'Job list fetched successfully', jobs);
  } catch (error) {
    return errorResponse(res, 500, 'Failed to fetch jobs', error.message);
  }
};

exports.getJobById = async (req, res) => {
  try {
    const jobNo = req.params.id;
    const job = await JobMastService.getJobById(jobNo);
    if (!job) return errorResponse(res, 404, 'Job not found');
    return successResponse(res, 'Job fetched successfully', job);
  } catch (error) {
    return errorResponse(res, 500, 'Failed to fetch job', error.message);
  }
};

exports.updateJob = async (req, res) => {
  try {
    const jobNo = req.params.id;
    const jobData = req.body;
    const updatedJob = await JobMastService.updateJob(jobNo, jobData);
    return successResponse(res, 'Job updated successfully', updatedJob);
  } catch (error) {
    return errorResponse(res, 500, 'Failed to update job', error.message);
  }
};

exports.deleteJob = async (req, res) => {
  try {
    const jobNo = req.params.id;
    await JobMastService.deleteJob(jobNo);
    return successResponse(res, 'Job deleted successfully');
  } catch (error) {
    return errorResponse(res, 500, 'Failed to delete job', error.message);
  }
};