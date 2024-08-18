const express = require('express');
const { student_registration } = require('../controller/admin/student_registration');
const router = express.Router();

//student registration routes 
router.post("/student-register",student_registration);

module.exports=router