//
require("dotenv").config();   // adding for jwt token
let express= require('express');
//import routes
const authRoutes = require("./routes/authRoutes");
 const pgRoutes = require("./routes/pgRoutes");
const supportRoutes = require('./routes/supportRoutes');
// //help in front back diff port
// const cors = require("cors");
// //let {dbconnection}
// require('./db');

// let app=express();
// app.use(express.json());
// // to handle URL-encoded data from forms
// app.use(express.urlencoded({ extended: true }));
// app.use(cors({
//   origin: "http://localhost:5173",
//   credentials: true
// }));
// app.use("/api", authRoutes);
// app.use("/api/pgs", pgRoutes);
// app.use("/api/support", supportRoutes);

// app.listen(5000,() => {
//     console.log("Server running on port 5000");
//     });
//      //dbconnection();

// ... (your other imports)

const cors = require("cors");
require('./db');

let app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// --- UPDATED CORS SETUP ---
const allowedOrigins = [
  "http://localhost:5173",             // Local development
  "https://scholar-shelter.vercel.app" // Production frontend
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, or Postman)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));
// ---------------------------

app.use("/api", authRoutes);
app.use("/api/pgs", pgRoutes);
app.use("/api/support", supportRoutes);

app.listen(5000, () => {
    console.log("Server running on port 5000");
});