const express = require('express');
const { verify_token } = require('../middlewares/verify_token');
const { add_complaint, show_complaint_by_id} = require('../controller/student/complaint');
const router = express.Router();
//add complaint 
router.post('/add-complaint',verify_token,add_complaint);
//show complaint id wise
router.get('/show-complaint/:id',verify_token,show_complaint_by_id);
//exports routes 
module.exports =router