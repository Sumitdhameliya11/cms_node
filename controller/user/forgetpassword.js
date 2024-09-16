const config = require('../../model/config')
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {SendEmail} = require("../../helper/sendmail");

//user passeord forgot api controller

const user_forgotpassword = async(req, res) => {
  try {
    if (!req.params.email) {
      return res.status(400).json({
        sucess: false,
        messaeg: "email not found !",
      });
    }
     await config.query(
      "select * from users  where email = ?",
      [req.params.email],
      async(err, result, fields) => {
        if (err) {
          return res.status(400).json({
            sucess: false,
            messaeg: "fetching server error",
            error: err,
          });
        }
        if(result.length === 0){
          return res.status(400).json({
            sucess:false,
            message:"provied valied email"
          })
        }
        else{
          const user = {
            user_id: result[0].id,
          }
          const token = await new Promise((resolve, reject) => {
            jwt.sign(
              { user },
              process.env.JWT_SECRETKEY,
              { expiresIn: "10m" },
              (err, token) => {
                if (err) {
                  return reject(err);
                }
                return resolve(token);
              }
            );
          });
          //user reset passwod url cerate
          const resetpasswordurl = `${process.env.BASE_URL}/reset-password/${result[0].id}/${token}`;
          const message =  `Please click on the following link, or paste this into your browser to complete the process:\n\n${resetpasswordurl}`
          //url sending in user email account
          const isMailSent  = await SendEmail(req.params.email,message,"Reset Password Of Sutex Compalint Managment System Dashboard");
          if(isMailSent){
              return res.status(200).json({
                  sucess:true,
                  message:"reset passswrod link send sucessfully"
              })
          }else{
              return res.status(400).json({sucess:false,message:"reset password link sending error"});
          }
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      messaeg: "Internal server error",
      error: error,
    });
  }
};

//reset password controller

const reset_passwrod = async (req, res) => {
  try {

    const requiredFields = [
      "password",
      "cpassword"
    ];

    const missingFields = requiredFields.filter((field) => !req.body[field]);

    if (missingFields.length > 0) {
      return res.status(400).json({
        error: `Please fill in the following fields: ${missingFields.join(
          ", "
        )}`,
      });
    }
    const { id, token } = req.params;
    //id and token is arrived or not
    
    if (!id || !token) {
      return res.status(400).json({
        sucess: false,
        message: "id and token not found !",
      });
    }
    //passowrd is arrived or not
    if (req.body.password !== req.body.cpassword) {
      return res.status(400).json({
        sucess: false,
        message: "passwrod is not match!",
      });
    }

    //encrypt password create

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    await jwt.verify(token, process.env.JWT_SECRETKEY, (err, valid) => {
      if (err) {
        return res
          .status(401)
          .json({ sucess: false, message: "provied vaild token" });
      }

      //update password
      config.query(
        "update users set password = ? where id = ?",
        [hashedPassword, req.params.id],
        (err, result, fields) => {
          if (err) {
            return res.status(400).json({
              sucess: false,
              message: "update data server error",
              error: err,
            });
          }
          return res.status(200).json({
            sucess: true,
            message: "password update sucessfully",
          });
        }
      );
    });
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Internal server error",
      error: error,
    });
  }
};

module.exports = {
  user_forgotpassword,
  reset_passwrod,
};