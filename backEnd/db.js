// const {MongoClient}=require('mongodb');
// const url='mongodb://127.0.0.1:27017';
// const client =new MongoClient(url);
// const dbconnection=async()=>{
//    await client.connect();
//    console.log("database connected");
//    let db=client.db("scholarShelter");
//    return db;
   
// }

// module.exports={dbconnection};
const URL = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/scholarShelter';
require('dotenv').config();
let mongoose=require('mongoose');
mongoose.connect(process.env.URL).then(()=>
{ console.log("database connected");
     });