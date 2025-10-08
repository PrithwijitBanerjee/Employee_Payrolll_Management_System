const projectService = require('../service/projectService');
const { successResponse, errorResponse } = require('../utils/response');

module.exports = {
    async create(req, res) {
        try {
            const project = await projectService.createProject(req.body);
            return successResponse(res, 'Project created successfully.', project);
        } catch (error) {
            return errorResponse(res, 400, error.message, error);
        }
    },

    async getAll(req, res) {
        try {
            const projects = await projectService.getAllProjects();
            return successResponse(res, 'Projects fetched successfully.', projects);
        } catch (error) {
            return errorResponse(res, 500, 'Failed to fetch projects.', error);
        }
    },

    async getByCode(req, res) {
        try {
            const { code } = req.params;
            const project = await projectService.getProjectByCode(code);
            return successResponse(res, 'Project fetched successfully.', project);
        } catch (error) {
            return errorResponse(res, 404, error.message, error);
        }
    },

    async update(req, res) {
        try {
            const { code } = req.params;
            const updated = await projectService.updateProject(code, req.body);
            return successResponse(res, 'Project updated successfully.', updated);
        } catch (error) {
            return errorResponse(res, 400, error.message, error);
        }
    },

    async remove(req, res) {
        try {
            const { code } = req.params;
            const result = await projectService.deleteProject(code);
            return successResponse(res, result.message);
        } catch (error) {
            return errorResponse(res, 404, error.message, error);
        }
    }
};