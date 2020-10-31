var mongoose=require("mongoose");
mongoose.connect('mongodb://localhost:27017/score',{useNewUrlParser:true});
var conne=mongoose.connection;
var codeSchema=new mongoose.Schema({
username:String,
pid:String,
language:String,
code:String
});
var codeModel=mongoose.model("Code",codeSchema);
module.exports=codeModel;