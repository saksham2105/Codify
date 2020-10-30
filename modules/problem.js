var mongoose=require("mongoose");
mongoose.connect('mongodb://localhost:27017/problem',{useNewUrlParser:true});
var conn=mongoose.connection;
var problemSchema=new mongoose.Schema({
pid:String,
name:String,
description:String,
testcases:Array,
expectedoutput:Array
});
var problemModel=mongoose.model("Problem",problemSchema);
module.exports=problemModel;