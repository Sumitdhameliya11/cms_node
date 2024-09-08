const config = require('../../model/config');
const {validation}=require('../../helper/validation');

//Show complaint
const show_complaint = async (req, res) => {
    try {
      await config.query(
        "select * from complaint where isdelete = 'false' and status = 'pending'",
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

  //search complaint by priority
  const search_complaint = async (req, res) => {
    try {
      if(!req.params.priority){
          return res.status(404).json({
              sucess:false,
              message:"complaint not found",
              err
          })
      }
      await config.query("select * from complaint where priority like ? and isdelete = 'false'and status = 'pending'",[`%${req.params.priority.trim()}%`],(err,result)=>{
          if(err){
              return res.status(400).json({
                  sucess:false,
                  message:"fetch complaint details error",
                  err
              })
          }
          return res.status(200).json({
              sucess:true,
              message:"fetch complaint details successfully",
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

  //update complaint details
const update_complaint = async (req, res) => {
    try {
      if(!req.params.id){
          return res.status(404).json({
              sucess:false,
              message:"id not found"
          })
      }
      //check required fields blank or not
      const requiredFields = [
        "status",
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
      config.query("select name from users where id = ?",[req.body.userId],(err,result)=>{
        if(err){
            return res.status(400).json({
                sucess:false,
                message:"fetch user data error"
            })
        }
        const name = result[0]?.name;
        //collect the all request
      const data = {
        resolve_date:new Date().toISOString().split('T')[0],
        resolver_name:name,
        status:req.body.status,
        resolve_ip:req.ip,
        isdelete: req.body.isdelete,
      };
      // Filter out not undefined or null fields without deleting keys
      const field = Object.keys(data).filter(
        (key) => data[key] !== undefined && data[key] !== null
      );
      const value = field.map((key) => data[key]);
      const updateQuery = `update complaint set ${field
        .map((field) => `${field} = ?`)
        .join(", ")} where id = ?`;
       config.query(
        updateQuery,
        [...value, req.params.id],
        (err, result, fields) => {
          if (err) {
            return res.status(400).json({
              sucess: false,
              message: "update exam details error",
              err,
            });
          }
          return res.status(200).json({
            sucess: true,
            message: "Save Change Successfully",
          });
        }
      );
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
    show_complaint,
    update_complaint,
    search_complaint
  }