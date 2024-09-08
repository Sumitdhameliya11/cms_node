const config = require("../../model/config");
const {validation} = require('../../helper/validation');

const add_complaint = async (req, res) => {
    try {
      //check required fields blank or not
      const requiredFields = [
        "email",
        "Mobile_number",
        'category',
        "subcategory",
        "problem",
        "priority",
        "sutno",
        "create_date",
      ];
  
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

      //collect the all request
      const examdata = {
        user_id : req.body.user_id,
        email:req.body.email,
        Mobile_number:req.body.Mobile_number,
        category:req.body.category,
        subcategory:req.body.subcategory,
        problem:req.body.problem,
        create_date:req.body.create_date,
        sutno:req.body.sutno,
        computer_ip:req.ip,
        priority:req.body.priority
      };
      //add data in database
      await config.query(
        "insert into complaint set ?",
        [examdata],
        (err, result, fields) => {
          if (err) {
            return res.status(400).json({
              sucess: false,
              message: "add complaint data error",
              err,
            });
          }
          return res.status(200).json({
            sucess: false,
            message: "complaint data add sucessfully",
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

//Show complaint
const show_complaint_by_id = async (req, res) => {
    try {
        if(!req.params.id){
            return res.status(404).json({
                sucess:false,
                message:"id not found"
            })
        }
      await config.query(
        "select * from complaint where user_id = ? and  isdelete = 'false' and status = 'pending'",[req.params.id],
        (err, result) => {
          if (err) {
            return res.status(400).json({
              sucess: false,
              message: "fetch complaint details error",
              err,
            });
          }
          return res.status(200).json({
            sucess: true,
            message: "fetch exam complaint sucessfully",
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

  

  module.exports={
    show_complaint_by_id,
    add_complaint
  }