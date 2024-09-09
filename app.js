const db = require("./model/config");
const express = require("express");
const app = express();
const cors = require("cors");
const staff = require("./routes/staff");
const admin = require("./routes/admin");
const user = require("./routes/user");
const student = require("./routes/student");
app.use(cors());
app.use(express.json());

app.get("/test", (req, res) => {
  res.send("Hello world");
});

//check the connection is use or not
app.get("/", (req, res) => {
  db.query("select 1+1 as solution ", (err, result, fields) => {
    if (err) {
      console.error("Database Query Error", err);
      res.status(500).json({
        sucess: false,
        message: "Database connection erorr",
      });
    } else {
      res.send("the Sloution is :" + result[0].solution);
    }
  });
});

//staff main routes
app.use("/api/staff", staff);
//admin main routes
app.use("/api/admin", admin);
//user main routes
app.use("/api/user", user);
//student main routes
app.use('/api/student',student);
//server port listen
app.listen(process.env.PORT || 8045, () => {
  console.log(`prot running on http://localhost:${process.env.PORT}/`);
});
