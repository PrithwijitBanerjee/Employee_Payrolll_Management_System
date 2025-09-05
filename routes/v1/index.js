var express = require('express');
var router = express.Router();

var adminsRouter=require('./admin')
var usersRouter=require('./user')


const middleware = require('../../middlewares/middleware');
const authController = require('../../controllers/authController');

router.post('/register', authController.register);
router.post('/login', authController.login);


router.use(middleware); 

router.use('/admin',adminsRouter)
router.use('/user',usersRouter)
module.exports = router;