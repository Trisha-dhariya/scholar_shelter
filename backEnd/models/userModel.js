const mongoose=require('mongoose');
const schema=mongoose.Schema;
const userSchema = new schema({
    userName:{
        type:String,
        required:true,
        unique:true
      },
    email:{
        type:String,
        required:true,
        
    },
    password:{
      type:String,
        required:true,
        
    },
    profileImage: { type: String, default: "" },
    profileCompleted: {
    type: Boolean,
    default: false
    },
    role:{
      type:String,
        required:true,
        
    },


});
const userModel= mongoose.model("users",userSchema);
module.exports=userModel;