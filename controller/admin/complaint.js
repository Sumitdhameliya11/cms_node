const config = require("../../model/config");
const { validation } = require("../../helper/validation");

//update exam data
const update_complaint = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(404).json({
        sucess: false,
        message: "id not found",
      });
    }
    //check required fields blank or not
    const requiredFields = [
      "email",
      "category",
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
    let resolve_ip ;
    if(req.body.status === 'complete'){
        resolve_ip = req.ip
    }
    //collect the all request
    const examdata = {
      user_id: req.body.user_id,
      email: req.body.email,
      Mobile_number: req.body.Mobile_number,
      category: req.body.category,
      subcategory: req.body.subcategory,
      problem: req.body.problem,
      create_date: req.body.create_date,
      resolve_date: req.body.resolve_date,
      resolver_name: req.body.resolver_name,
      status: req.body.status,
      sutno: req.body.sutno,
      computer_ip:req.ip,
      resolve_ip: resolve_ip,
      priority: req.body.prioritys,
      isdelete: req.body.isdelete,
    };
    // Filter out not undefined or null fields without deleting keys
    const field = Object.keys(examdata).filter(
      (key) => examdata[key] !== undefined && examdata[key] !== null
    );
    const value = field.map((key) => examdata[key]);
    const updateQuery = `update complaint set ${field
      .map((field) => `${field} = ?`)
      .join(", ")} where id = ?`;
    await config.query(
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
  } catch (error) {
    return res.status(500).json({
      sucess: false,
      message: "Internal Server Error!",
      error: `${error.message}`,
    });
  }
};

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
    if (!req.params.priority) {
      return res.status(404).json({
        sucess: false,
        message: "complaint not found",
        err,
      });
    }
    await config.query(
      "select * from complaint where priority like ? and isdelete = 'false' and status = 'pending'",
      [`%${req.params.priority.trim()}%`],
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
          message: "fetch complaint details successfully",
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

//delete complaint
const delete_complaint = async (req, res) => {
    try {
      if(!req.params.id){
          return res.status(400).json({
              sucess:false,
              message:"id not found"
          })
      }
      await config.query("update complaint set isdelete = 'true' where id = ?",[req.params.id],(err,result)=>{
          if(err){
              return res.status(400).json({
                  sucess:false,
                  message:"delete complaint details error",
                  err
              })
          }
          return res.status(200).json({
              sucess:true,
              message:"delete complaint sucessfully"
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

module.exports = {
  update_complaint,
  show_complaint,
  search_complaint,
  delete_complaint
};
