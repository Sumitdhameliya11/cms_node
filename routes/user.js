const express =require('express');
const { login } = require('../controller/user/login');
const { verify_token } = require('../middlewares/verify_token');
const { change_password } = require('../controller/user/changepassword');
const router = express.Router();

//login routes
router.post('/login',login);
//change password  
router.put('/change-password/:id',verify_token,change_password);
module.exports = login;