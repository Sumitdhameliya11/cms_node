const jwt = require('jsonwebtoken');
const jwtkey = process.env.JWT_SECRETKEY;

const verify_token = async(req,res,next)=>{
    const token = req.headers["authorization"];
    if(token){
        token = token.split(" ")[2];
        jwt.verify(token,jwtkey,(err,valid)=>{
            if(err){
                return res.status(400).json({
                    sucess:false,
                    message:"provied valied token"
                })
            }else{
                next();
            }
        })
    }else{
        return res.status(400).json({
            sucess:false,
            message:"authorized forbin"
        })
    }
}

module.exports={
    verify_token
}