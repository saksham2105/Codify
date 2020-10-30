var mongoose=require("mongoose");
mongoose.connect('mongodb://localhost:27017/score',{useNewUrlParser:true});
var conne=mongoose.connection;
var scoreSchema=new mongoose.Schema({
username:String,
score:Number,
});
var scoreModel=mongoose.model("Score",scoreSchema);
module.exports=scoreModel;