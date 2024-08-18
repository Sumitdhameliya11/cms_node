const express =require('express');
const { login } = require('../controller/user/login');
const router = express.Router();

//login routes
router.post('/login',login);

module.exports = login;