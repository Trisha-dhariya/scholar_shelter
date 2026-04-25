//
require("dotenv").config();   // adding for jwt token
let express= require('express');
//import routes
const authRoutes = require("./routes/authRoutes");
const pgRoutes = require("./routes/pgRoutes");
//help in front back diff port
const cors = require("cors");
//let {dbconnection}
require('./db');

let app=express();
app.use(express.json());
// to handle URL-encoded data from forms
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true
}));
app.use("/api", authRoutes);
app.use("/api/pgs", pgRoutes);


app.listen(5000,() => {
    console.log("Server running on port 5000");
    });
     //dbconnection();

