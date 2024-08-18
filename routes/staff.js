const express = require('express');
const { staff_registration } = require('../controller/staff/staff_registration');
const router = express.Router();

//staff registration routes
router.post('/staff-register',staff_registration);

//exports routes 
module.exports =router