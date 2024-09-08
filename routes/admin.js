const express = require("express");
const { student_registration } = require("../controller/admin/registration");
const { verify_token } = require("../middlewares/verify_token");
const {
  update_userdata,
  delete_user,
  show_student_details,
  show_staff_details,
  show_admin_details,
  search_user,
} = require("../controller/admin/AllUser");
const {
  update_complaint,
  show_complaint,
  search_complaint,
  delete_complaint,
} = require("../controller/admin/complaint");
const router = express.Router();

//student registration routes
router.post("/register", student_registration);
//update userdata
router.put("/update-user/:id", verify_token, update_userdata);
//delete user data
router.delete("/delete-user/:id", verify_token, delete_user);
//show student details
router.get("/show-student", verify_token, show_student_details);
//show staff details
router.get("/show-staff", verify_token, show_staff_details);
//show admin details
router.get("/show-admin", verify_token, show_admin_details);
//search user
router.get("/search-user/:email", verify_token, search_user);
//update complaint
router.put("/update-complaint/:id", verify_token, update_complaint);
//show complaint
router.get("/show-complaint", verify_token, show_complaint);
//show complaint by priority
router.get("/search-comaplaint/:priority", verify_token, search_complaint);
//delete complaint
router.delete("/delete-complaint/:id", verify_token, delete_complaint);
module.exports = router;
