var express = require('express');
var router = express.Router();
const multer = require('multer');
var storage = multer.memoryStorage()
var upload = multer({ storage: storage });


///////////////////////////////////////  epin ///////////////////////////////////////////////////

const roleController = require("../../controllers/roleController");
router.post("/create-role", roleController.create);
router.get("/get-role", roleController.getAll);
router.get("/get-role/:id", roleController.getById);
router.put("/update-role/:id", roleController.update);
router.delete("/delete-role/:id", roleController.delete);

const userController = require('../../controllers/user.controller');
router.get("/get-user", userController.getAllUsers);

const projHelpController = require('../../controllers/projHelpController');
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

module.exports = router;