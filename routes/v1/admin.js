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

const authController = require('../../controllers/authController');
router.get("/get-user", authController.getAllUsers);

module.exports = router;