const logout = (req, res) => {
    try {
      let token = req.headers["authorization"];
      if (!token) {
        return res.status(401).json({ sucess: false, message: "Provied Token" });
      }
      token = token.split(" ")[2];
      res.status(200).json({ sucess: true, message: "Logout Sucessfully" });
    } catch (error) {
      return res.status(500).json({
        sucess: false,
        message: "Internal Server Error",
      });
    }
  };
  
  module.exports = {
    logout,
  };