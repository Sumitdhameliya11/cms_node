const config = require("../../model/config");
const bcrypt = require("bcrypt");
const { validation } = require("../../helper/validation");

const update_userdata = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(404).json({
        sucess: false,
        message: "id not found",
      });
    }
    //check required fields blank or not
    const requiredFields = ["name", "email", "password", "cpassword", "role"];
    const validateerror = await new Promise((resolve, reject) => {
      validation(requiredFields, req.body)
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          reject(error);
        });
    });
    if (validateerror) {
      return res.status(400).json({
        sucess: false,
        message: `Missing required fields not blank: ${validateerror.join(
          ", "
        )}`,
      });
    }
    //check password is match or not
    if (req.body.password !== cpassword) {
      return res.status(400).json({
        sucess: false,
        message: "Password Does Not Match",
      });
    }

    //cretae hash password
    const hashpassword = await bcrypt.hash(req.body.password,10);
    //collect the all request
    const examdata = {
      name: req.body.name,
      email: req.body.email,
      password: hashpassword,
      role: req.body.role,
      isdelete: req.body.isdelete,
    };
    // Filter out not undefined or null fields without deleting keys
    const field = Object.keys(examdata).filter(
      (key) => examdata[key] !== undefined && examdata[key] !== null
    );
    const value = field.map((key) => examdata[key]);
    const updateQuery = `update users set ${field
      .map((field) => `${field} = ?`)
      .join(", ")} where id = ?`;
    await config.query(
      updateQuery,
      [...value, req.params.id],
      (err, result, fields) => {
        if (err) {
          return res.status(400).json({
            sucess: false,
            message: "update users details error",
            err,
          });
        }
        return res.status(200).json({
          sucess: true,
          message: "Save Change Successfully",
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Internal server error",
      error: `${error.message}`,
    });
  }
};

//delete user details 
const delete_user = async (req, res) => {
  try {
    if(!req.params.id){
        return res.status(400).json({
            sucess:false,
            message:"id not found"
        })
    }
    await config.query("update users set isdelete = 'true' where id = ?",[req.params.id],(err,result)=>{
        if(err){
            return res.status(400).json({
                sucess:false,
                message:"delete user details error",
                err
            })
        }
        return res.status(200).json({
            sucess:true,
            message:"delete user sucessfully"
        })
    })
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Internal Server Error!",
      error: `${error.message}`,
    });
  }
};

//show student details 
const show_student_details = async (req, res) => {
  try {
    await config.query(
      "select * from users where role = 'student' and isdelete = 'false'",
      (err, result) => {
        if (err) {
          return res.status(400).json({
            sucess: false,
            message: "fetch student details error",
            err,
          });
        }
        return res.status(200).json({
          sucess: true,
          message: "fetch student data sucessfully",
          Data: result,
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Internal Server Error!",
      error: `${error.message}`,
    });
  }
};

//Show staff details
const show_staff_details = async (req, res) => {
  try {
    await config.query(
      "select * from users where role = 'staff' and  isdelete = 'false'",
      (err, result) => {
        if (err) {
          return res.status(400).json({
            sucess: false,
            message: "fetch staff details error",
            err,
          });
        }
        return res.status(200).json({
          sucess: true,
          message: "fetch staff data sucessfully",
          Data: result,
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Internal Server Error!",
      error: `${error.message}`,
    });
  }
};

//show admin details 
const show_admin_details = async (req, res) => {
  try {
    await config.query(
      "select * from users where role = 'admin' and  isdelete = 'false'",
      (err, result) => {
        if (err) {
          return res.status(400).json({
            sucess: false,
            message: "fetch admin details error",
            err,
          });
        }
        return res.status(200).json({
          sucess: true,
          message: "fetch admin  data sucessfully",
          Data: result,
        });
      }
    );
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Internal Server Error!",
      error: `${error.message}`,
    });
  }
};

//search admin user by email 
const search_admin_user = async (req, res) => {
  try {
    if(!req.params.email){
        return res.status(404).json({
            sucess:false,
            message:"email not found",
            err
        })
    }
    await config.query("select * from users where email like ? and isdelete = 'false' and role = admin",[`%${req.params.email.trim()}%`],(err,result)=>{
        if(err){
            return res.status(400).json({
                sucess:false,
                message:"fetch user details error",
                err
            })
        }
        return res.status(200).json({
            sucess:true,
            message:"fetch user details successfully",
            Data:result
        })
    })
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Internal Server Error!",
      error: `${error.message}`,
    });
  }
};

//search staff user by email 
const search_staff_user = async (req, res) => {
  try {
    if(!req.params.email){
        return res.status(404).json({
            sucess:false,
            message:"email not found",
            err
        })
    }
    await config.query("select * from users where email like ? and isdelete = 'false' and role = staff",[`%${req.params.email.trim()}%`],(err,result)=>{
        if(err){
            return res.status(400).json({
                sucess:false,
                message:"fetch user details error",
                err
            })
        }
        return res.status(200).json({
            sucess:true,
            message:"fetch user details successfully",
            Data:result
        })
    })
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Internal Server Error!",
      error: `${error.message}`,
    });
  }
};

//search user by email 
const search_student_user = async (req, res) => {
  try {
    if(!req.params.email){
        return res.status(404).json({
            sucess:false,
            message:"email not found",
            err
        })
    }
    await config.query("select * from users where email like ? and isdelete = 'false' and role = student",[`%${req.params.email.trim()}%`],(err,result)=>{
        if(err){
            return res.status(400).json({
                sucess:false,
                message:"fetch user details error",
                err
            })
        }
        return res.status(200).json({
            sucess:true,
            message:"fetch user details successfully",
            Data:result
        })
    })
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Internal Server Error!",
      error: `${error.message}`,
    });
  }
};
module.exports={
    update_userdata,
    delete_user,
    show_student_details,
    show_staff_details,
    show_admin_details,
    search_student_user,
    search_admin_user,
    search_staff_user
}