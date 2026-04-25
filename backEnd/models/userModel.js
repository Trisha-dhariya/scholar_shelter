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
    profileCompleted: {
  type: Boolean,
  default: false
}

});
const userModel= mongoose.model("users",userSchema);
module.exports=userModel;