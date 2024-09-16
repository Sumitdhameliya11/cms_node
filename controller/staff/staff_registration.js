const config = require("../../model/config");
const {validation} = require("../../helper/validation");
const { SendEmail } = require("../../helper/sendmail");
const bcrypt = require('bcrypt');
//staff registration 
const  staff_registration = async(req,res)=>{
    try {
        //check the required fields is blank or not 
        const requiredFields=[
            'name',
            'email',
            'password',
            'cpassword',
            'role'
        ];
        const validateerror = await new Promise((resolve,reject)=>{
            validation(requiredFields,req.body).then((res)=>{
                return resolve(res);
            }).catch((error)=>{return reject(error)});
        })
        if (validateerror) {
            return res.status(400).json({
              sucess: false,
              message: `Missing required fields not blank: ${validateerror.join(
                ", "
              )}`,
            });
          }
          //check the password is match or not 
    if (req.body.password !== req.body.cpassword) {
      return res.status(400).json({
        sucess: false,
        message: "Your Password Does Not Match",
      });
    }
    //check the users exists or not 
    const userExists = await new Promise((resolve, reject) => {
      config.query(
        "SELECT * FROM users WHERE email = ?",
        req.body.email,
        (error, result, fields) => {
          if (error) {
            return reject(error);
          }
          return resolve(result);
        }
      );
    });
    if (userExists.length > 0) {
      return res.status(400).json({ error: "Email Already Registered" });
    }

    //create a hash password
    const hashpassword = await bcrypt.hash(req.body.password,10);
    //staff details
          const staffdata ={
            name:req.body.name,
            email:req.body.email,
            password:hashpassword,
            role:req.body.role
          }
          await config.query("insert into users set ?",[staffdata],(err,result,fields)=>{
            if(err){
                return res.status(400).json({
                    sucess:false,
                    message:"Registration failed",
                    err
                })
            }
            const ismailsent = SendEmail(req.body.email, `Dear ${req.body.name},<br/>Welcome to sutex complanit system!<br/>Your registration was successfully. Here are your account details: .<br/><br/>Email: ${req.body.email}<br/>Password: ${req.body.password}<br/><br/>Please keep this information secure and do not share it with anyone.<br/>You can now log in to your account and start using our services. If you have any questions or need assistance, feel free to reach out to our support team. <br/>its contact number here: Contact No:9106777461<br/>Best regards,<br/>Sutex Complaint Management System`,
              "Rgistration conformation")
              if(!ismailsent){
                return res.status(400).json({
                  sucess:false,
                  message:"registration email send error"
                })
              }
            return res.status(200).json({
                sucess:true,
                message:"Registration sucessfully"
            })
          })
    } catch (error) {
        return res.status(500).json({
            sucess:false,
            message:"Internal servre error",
            error:`${error.message}`
        })
    }
}

module.exports={
    staff_registration
}