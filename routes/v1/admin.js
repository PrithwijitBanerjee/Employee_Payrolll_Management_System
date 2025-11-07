var express = require('express');
var router = express.Router();
const multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });


///////////////////////////////////////  epin ///////////////////////////////////////////////////

const roleController = require("../../controllers/role.controller");
router.post("/create-role", roleController.create);
router.get("/get-role", roleController.getAll);
router.get("/get-role/:id", roleController.getById);
router.put("/update-role/:id", roleController.update);
router.delete("/delete-role/:id", roleController.delete);

const userController = require('../../controllers/user.controller');
router.get("/get-user", userController.getAllUsers);

const projHelpController = require('../../controllers/projHelp.controller');
router.post('/create-projectHelp', projHelpController.createProjHelp);
router.get('/getAll-projectHelp', projHelpController.getAllProjHelp);
router.get('/get-projectHelp/:code', projHelpController.getProjHelpByCode);
router.put('/update-projectHelp/:code', projHelpController.updateProjHelp);
router.delete('/delete-projectHelp/:code', projHelpController.deleteProjHelp);

const departmentController = require('../../controllers/department.controller');
router.post('/create-department', departmentController.createDepartment);
router.get('/get-departments', departmentController.getAllDepartments);
router.get('/get-department/:DeptCode', departmentController.getDepartmentByCode);
router.put('/update-department/:DeptCode', departmentController.updateDepartment);
router.delete('/delete-department/:DeptCode', departmentController.deleteDepartment);

const DesignationController = require("../../controllers/designation.controller");
router.post("/create-designation", DesignationController.createDesignation);
router.get("/get-designations", DesignationController.getAllDesignations);
router.get("/get-designation/:code", DesignationController.getDesignationByCode);
router.put("/update-designation/:code", DesignationController.updateDesignation);
router.delete("/delete-designation/:code", DesignationController.deleteDesignation);

const EmployeeController = require("../../controllers/employee.controller");
router.post("/create-employee", EmployeeController.create);
router.get("/get-employes", EmployeeController.getAll);
router.get("/get-employee/:emplCode", EmployeeController.getById);
router.put("/update-employee/:emplCode", EmployeeController.update);
router.delete("/delete-employee/:emplCode", EmployeeController.remove);

const ClientController = require("../../controllers/client.controller");
router.post("/create-client", ClientController.createClient);
router.get("/get-client", ClientController.getAllClients);
router.get("/get-client/:clientCode", ClientController.getClientByCode);
router.put("/update-client/:clientCode", ClientController.updateClient);
router.delete("/delete-client/:clientCode", ClientController.deleteClient);

const projectController = require('../../controllers/project.controller');
router.post('/create-project', projectController.create);
router.get('/get-projects', projectController.getAll);
router.get('/get-project/:code', projectController.getByCode);
router.put('/update-project/:code', projectController.update);
router.delete('/delete-project/:code', projectController.remove);

const jobmastController = require('../../controllers/jobmast.controller');
router.post('/create-jobmast', jobmastController.createJob);
router.get('/get-jobmasts', jobmastController.getAllJobs);
router.get('/get-jobmast/:id', jobmastController.getJobById);
router.put('/update-jobmast/:id', jobmastController.updateJob);
router.delete('/delete-jobmast/:id', jobmastController.deleteJob);

const JobDetlController = require("../../controllers/jobDetl.controller");
router.post("/create-job", JobDetlController.create);
router.post("/create-jobs", JobDetlController.createMultiple);
router.get("/get-jobs", JobDetlController.getAll);
router.get("/get-job/:JobNo", JobDetlController.getById);
router.put("/update-job/:JobNo", JobDetlController.update);
router.delete("/delete-job/:JobNo", JobDetlController.delete);

module.exports = router;