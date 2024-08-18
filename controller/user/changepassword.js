const config = require("../../model/config");
const { validation } = require("../../helper/validation");
const { SendEmail } = require("../../helper/sendmail");
const bcrypt = require("bcrypt");

//user password change
const change_password = async (req, res) => {
  try {
    //check requirefields is blank or not
    const requiredFields = ["oldpassword", "newpassword", "cpassword"];
    const validateerror = await new Promise((resolve, reject) => {
      validation(requiredFields, req.body)
        .then((res) => {
          return resolve(res);
        })
        .catch((error) => {
          return reject(error);
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
    //fetch the password from database
    const user_password = await new Promise((resolve, reject) => {
      config.query(
        "select password from users where id = ?",
        req.params.userid,
        (error, result, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(result[0].password);
        }
      );
    });

    //check password is correct or not 
    const passmatch = await bcrypt.compare(req.body.oldpassword,user_password);
    if(!passmatch){
        return res.status(400).json({
            sucess:false,
            message:"Your Current Password Is Wrong"
        })
    }
    //convert the password in encryption from
    const hashpassword = await bcrypt.hash(req.body.newpassword,10);

    config.query('update users set password = ? where id = ?',[hashpassword,req.params.id],(err,result,fields)=>{
       if(err){
            return res.status(400).json({
                sucess:false,
                message:"change password error",
                err
            }) 
       }
       return res.status(200).json({
        sucess:true,
        message:"change password sucessfully"
       })
    })
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Internal server error",
      error: `${error.message}`,
    });
  }
};
