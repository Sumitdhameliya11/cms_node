const config = require("../../model/config");
const { SendEmail } = require("../../helper/sendmail");
const { validation } = require("../../helper/validation");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const jwtkey = process.env.JWT_SECRETKEY;
const login = async (req, res) => {
  try {
    //check the reuire fields is blank or not
    const requiredFields = ["email", "password"];
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
    await config.query(
      "select * from users where email = ? and isdelete = 'false'",
      [req.body.email],
      async (err, result, fields) => {
        if (err) {
          return res.status(400).json({
            sucess: false,
            message: "user data fetch error",
          });
        } else {
          if (result.length > 0) {
            const passmatch = await bcrypt.compare(
              req.body.password,
              result[0].password
            );
            if (passmatch) {
              const user = {
                user_id: result[0].id,
                email: result[0].email,
                role: result[0].role,
              };
              // genarate the token
              jwt.sign({ user }, jwtkey, { expiresIn: "24h" }, (err, token) => {
                if (err) {
                  return res.status(400).json({
                    sucess: false,
                    message: "Token Generating  Error",
                    err,
                  });
                }
                return res
                  .status(200)
                  .json({ sucess: false, Data: user, auth: token,message:"Login Succesfully"});
              });
              //sending Email
              const isMailSent = await SendEmail(
                user.email,
                "careersahi login alert if you not reset the passwrod otherwise Ignore",
                "Login Alert From Sutex Complaint System"
              );
              if (!isMailSent) {
                return res.status(400).json({
                  sucess: false,
                  message: "email sending error",
                });
              }
            } else {
              return res.status(401).json({
                sucess: false,
                message: "Authentication failed",
              });
            }
          } else {
            return res.status(400).json({
              sucess: false,
              message: "user not found",
            });
          }
        }
      }
    );
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      MessageChannel: "Internal server error",
      error: `${error.message}`,
    });
  }
};

module.exports = {
  login,
};
