var express = require('express');
var router = express.Router();

var adminsRouter=require('./admin')
var usersRouter=require('./user')


const middleware = require('../../middlewares/middleware');
const authController = require('../../controllers/auth.controller');

router.post('/login', authController.login);

const roleController = require("../../controllers/role.controller");
router.get("/get-role", roleController.getAll);

const projHelpController = require('../../controllers/projHelp.controller');
router.get('/get-projectHelp-tag/:tag', projHelpController.getProjHelpByTag);


router.use(middleware); 

router.use('/admin',adminsRouter)
router.use('/user',usersRouter)
module.exports = router;