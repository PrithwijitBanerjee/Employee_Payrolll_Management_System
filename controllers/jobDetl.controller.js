const JobDetlService = require("../service/jobDetl.service");

const JobDetlController = {
  async create(req, res) {
    try {
      const logedData = req.user;
      const job = await JobDetlService.createJob(req.body, logedData);
      res.status(201).json({ success: true, data: job });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const jobs = await JobDetlService.getAllJobs();
      res.status(200).json({ success: true, data: jobs });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async getById(req, res) {
    try {
      const { JobNo } = req.params;
      const job = await JobDetlService.getJobById(JobNo);
      if (!job)
        return res.status(404).json({ success: false, message: "Job not found" });
      res.status(200).json({ success: true, data: job });
    } catch (err) {
      res.status(500).json({ success: false, message: err.message });
    }
  },

  async update(req, res) {
    try {
      const { JobNo } = req.params;
      const job = await JobDetlService.updateJob(JobNo, req.body);
      res.status(200).json({ success: true, data: job });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },

  async delete(req, res) {
    try {
      const { JobNo } = req.params;
      await JobDetlService.deleteJob(JobNo);
      res.status(200).json({ success: true, message: "Job deleted successfully" });
    } catch (err) {
      res.status(400).json({ success: false, message: err.message });
    }
  },
};

module.exports = JobDetlController;
