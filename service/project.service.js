const Project = require('../Models/Project');
const ProjHelp = require('../Models/projhelp');
const {getNextCode} = require("../utils/codeGenerator");

module.exports = {
    async createProject(data) {
        const { ProjectName, SGSTRate, CGSTRate, IGSTRate, ProjectStatus } = data;

        if (ProjectStatus) {
            const statusExists = await ProjHelp.findByPk(ProjectStatus);
            if (!statusExists) {
                throw new Error('Invalid ProjectStatus code.');
            }
        }

        const newCode = await getNextCode(Project, "ProjectCode", 6);

        const project = await Project.create({
            ProjectCode : newCode,
            ProjectName,
            SGSTRate,
            CGSTRate,
            IGSTRate,
            ProjectStatus
        });

        return project;
    },

    async getAllProjects() {
        return await Project.findAll({
            include: [
                {
                    model: ProjHelp,
                    as: 'status',
                    attributes: ['code', 'data', 'tag']
                }
            ]
        });
    },

    async getProjectByCode(ProjectCode) {
        const project = await Project.findByPk(ProjectCode, {
            include: [
                {
                    model: ProjHelp,
                    as: 'status',
                    attributes: ['code', 'data', 'tag']
                }
            ]
        });

        if (!project) {
            throw new Error('Project not found.');
        }

        return project;
    },

    async updateProject(ProjectCode, data) {
        const project = await Project.findByPk(ProjectCode);
        if (!project) {
            throw new Error('Project not found.');
        }

        if (data.ProjectStatus) {
            const statusExists = await ProjHelp.findByPk(data.ProjectStatus);
            if (!statusExists) {
                throw new Error('Invalid ProjectStatus code.');
            }
        }

        await project.update(data);
        return project;
    },

    async deleteProject(ProjectCode) {
        const project = await Project.findByPk(ProjectCode);
        if (!project) {
            throw new Error('Project not found.');
        }

        await project.destroy();
        return { message: 'Project deleted successfully.' };
    }
};