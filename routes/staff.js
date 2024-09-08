const express = require('express');
const { staff_registration } = require('../controller/staff/staff_registration');
const { verify_token } = require('../middlewares/verify_token');
const { show_complaint, search_complaint, update_complaint } = require('../controller/staff/complaint');
const router = express.Router();

//staff registration routes
router.post('/staff-register',staff_registration);
//show staff complaint details 
router.get('/show-complaint',verify_token,show_complaint);
//search complaint details by priority
router.get('/search-complaint/:priority',verify_token,search_complaint);
//update comaplaint details 
router.put('/update-complaint/:id',verify_token,update_complaint);
//exports routes 
module.exports =router