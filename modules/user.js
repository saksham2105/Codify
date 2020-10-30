var mongoose=require("mongoose");
mongoose.connect('mongodb://localhost:27017/user',{useNewUrlParser:true});
var conn=mongoose.connection;
var userSchema=new mongoose.Schema({
firstname:String,
lastname:String,
username:String,
contactno:String,
password:String
});
var userModel=mongoose.model("User",userSchema);
module.exports=userModel;