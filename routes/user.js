const express =require('express');
const { login } = require('../controller/user/login');
const { verify_token } = require('../middlewares/verify_token');
const { change_password } = require('../controller/user/changepassword');
const { logout } = require('../controller/user/logout');
const { user_forgotpassword, reset_passwrod } = require('../controller/user/forgetpassword');
const router = express.Router();

//login routes
router.post('/login',login);
//change password  
router.put('/change-password/:id',verify_token,change_password);
//logout 
router.get('/logout',logout);
//forgot password
router.post('/forgot-password/:email',user_forgotpassword);
//reset password
router.post("/reset-password/:id/:token",reset_passwrod);

module.exports = router;