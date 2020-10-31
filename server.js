var express=require("express");
var path=require("path");
var fs=require("fs");
var path=require("path");
var similarity=require("similarity");
var useModel=require("./modules/user");
var probModel=require("./modules/problem");
var chkModel=require("./modules/check");
var scrModel=require("./modules/score");
var cdeModel=require("./modules/code");
var session = require('express-session'); 
var app=express();
var bodyParser=require("body-parser");
app.use(bodyParser());
app.use(express.static('public'));
var compiler=require("compilex");
const { exec } = require("child_process");
const { collection } = require("./modules/user");
const { Console } = require("console");
const { type } = require("os");
var user=useModel.find({});
var problem=probModel.find({});
var score=scrModel.find({});
var check=chkModel.find({});
var code=cdeModel.find({});
var option={stats:true};
compiler.init(option);

app.use(session({ 
secret: Math.random().toString(), 
resave: true, 
saveUninitialized: true
}));

/*app.get("/setsession",function(req,res){
    req.session.name = 'Saksham Solanki';
    return res.send("Session Set") 

});
app.get("/getsession", function(req, res){ 
   
    var name = req.session.name; 
    return res.send(name) 
   
     //req.session.destroy(function(error){ 
       // console.log("Session Destroyed") 
    //}) 
    
}) */
app.post('/getSimilarityScore',function(req,res){
var username=req.body.username;
var pid=req.body.pid;
var language=req.body.language;
var code=req.body.code;
cdeModel.find({pid:pid,language:language},function(err,data){
    var newarr=[];
    for(var element of data){
        if(element.username!=username) newarr.push(element);
    }
   var hasPlagiarism=false;
   var similarityArray=[]
   var similarityScore=0;
   for(var e of newarr)
   {
    console.log("Similarity "+similarity(code,e.code));
    if(similarity(code,e.code)>0.55)
    {
    similarityScore=similarity(code,e.code);
    hasPlagiarism=true;
    break;
    }
   }
   var responseWrapper={};
   if(hasPlagiarism)
   {
   responseWrapper.success=hasPlagiarism;
   responseWrapper.message="has plagiarism";
   responseWrapper.similarity=similarityScore;
   }
   else
   {
    responseWrapper.success=hasPlagiarism;
    responseWrapper.message="no plagiarism detected";
    responseWrapper.similarity=similarityScore;
    }
  res.send(responseWrapper);
});
});

app.post('/hasCodeFor',function(req,res){
var username=req.body.username;
var pid=req.body.pid;
var language=req.body.language;
cdeModel.find({username:username,pid:pid,language:language},function(err,records){
var responseWrapper={};
if(records.length==0)
{
responseWrapper.success=false;
responseWrapper.message="Code has not submitted for this problem";
res.send(responseWrapper);
}
else
{
responseWrapper.success=true;
responseWrapper.message=records;
res.send(responseWrapper);
}
});
});

app.post('/addCode',function(req,res){
var username=req.body.username;
var pid=req.body.pid;
var language=req.body.language;
var code=req.body.code;
var codeDetails=new cdeModel({
username:username,
pid:pid,
language:language,
code:code
});
codeDetails.save(function(err,res1){
    var responseWrapper={};
    if(err)
    {
    responseWrapper.success=false;
    responseWrapper.message="some error";
    res.send(responseWrapper);
    return;
    }
    else
    {
    responseWrapper.success=true;
    responseWrapper.message="Code has added successfully";
    res.send(responseWrapper);
    return;
    }
  
});
});

app.post('/updateCode',function(req,res){
var username=req.body.username;
var pid=req.body.pid;
var language=req.body.language;
var code=req.body.code;
cdeModel.update({username:username,pid:pid,language:language},{code:code},function(err,affetcted,raw){
var responseWrapper={};
if(err)
{
responseWrapper.success=false;
responseWrapper.message=err;
res.send(responseWrapper);
return;
}
else
{
responseWrapper.success=true;
responseWrapper.message="Code has changed successfully";
res.send(responseWrapper);
return;
}
});    
});
 

app.post('/hasProblemSolvedByUser',function(req,res){
var pid=req.body.pid;
var username=req.body.username;
chkModel.find({pid:pid,username:username},function(err,records){
var responseWrapper={};
if(records.length==0)
{
responseWrapper.success=false;
responseWrapper.message="Problem Not Solved by user";
res.send(responseWrapper);
}
else
{
responseWrapper.success=true;
responseWrapper.message="Problem  Solved by user";
res.send(responseWrapper);
}
});

});

app.post('/updateCheck',function(req,res){
var pid=req.body.pid;
var username=req.body.username;
var score=req.body.score;
var hasSolved=req.body.hasSolved;
var checkDetails=new chkModel({
    pid:pid,
    username:username,
    score:score,
    hasSolved:hasSolved
    });
    checkDetails.save(function(err,res1){
    var responseWrapper={};
    if(err)
    {
    responseWrapper.success=false;
    responseWrapper.message="some error";
    res.send(responseWrapper);
    return;
    }
    else
    {
    responseWrapper.success=true;
    responseWrapper.message="Check Model updated successfully";
    res.send(responseWrapper);
    return;
    }
    });
    
});

app.post('/exist',function(req,res){
    var username=req.body.username;
    useModel.find({username:username},function(err,data){
        var exists=false;
        if(data.length>0) exists=true;
        if(exists==true) 
        {
            var responseWrapper={};
            responseWrapper.success=true;
            responseWrapper.message="user exist";
            responseWrapper.code=200;
           res.send(responseWrapper);
           exists=false;
           return;
    
        }
        else
        {
        var responseWrapper={};
        responseWrapper.success=false;
        responseWrapper.message="user doesnt't exist";
        responseWrapper.code=404;
        res.send(responseWrapper);
        exists=false;
        return;
        }
    });
});

app.post('/validLogin',function(req,res){
    var username=req.body.username;
    var password=req.body.password;
    useModel.find({username:username},function(err,data){
        try {
               if(data[0].password==password)
               {
               var responseWrapper={};
                responseWrapper.success=true;
                responseWrapper.message="user exist";
                responseWrapper.code=200;
               res.send(responseWrapper);
               return;
               } 
               else
               {
                var responseWrapper={};
                responseWrapper.success=false;
                responseWrapper.message="username and password doesn't match";
                responseWrapper.code=404;
                res.send(responseWrapper);
               return;
    
               }    
    
        } catch (error) {
            
        }
    });

});

app.post('/createSession',function(req,res){
var username=req.body.username;
console.log("Create Session Invoked");
console.log(req.session.name);
if(req.session.name!=undefined || req.session.name!=null)
{
var responseWrapper={};
responseWrapper.success=false;
responseWrapper.message="Session against this username already exist";
res.send(responseWrapper);
return;
}
else
{
req.session.name = username;
var responseWrapper={};
responseWrapper.success=true;
responseWrapper.message="session created";
res.send(responseWrapper);
console.log("Session Created");
}
});

app.get('/logout',function(req,res){
    req.session.destroy(function(error){
    console.log("session Destroyed");
    if(!error)
    {
    var responseWrapper={};
    responseWrapper.success=true;
    responseWrapper.message="session destroyed";
    res.send(responseWrapper);
    }
    else
    {
        var responseWrapper={};
        responseWrapper.success=false;
        responseWrapper.message="session couldn't destroyed";
        res.send(responseWrapper);
    
    }
    });
});

app.get('/getSession',function(req,res){ 
  console.log("Get Session invoked");
  console.log(req.session.name==undefined);
  if(req.session.name==undefined)
  {
    var responseWrapper={};
    responseWrapper.success=false;
    responseWrapper.name=req.session.name;
    res.send(responseWrapper);
    return;  
      
  }
  else
  {
  var responseWrapper={};
  responseWrapper.success=true;
  responseWrapper.name=req.session.name;
  res.send(responseWrapper); 
  } 
});

app.post("/hasProblem",function(req,res){

});
app.get("/openProblemSetter",function(req,res){
  res.sendfile("setproblem.html");  
});
function createUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
       var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
       return v.toString(16);
    });
 }
app.post("/setProblem",function(req,res){
console.log("Set Problem invoked");
var pid=createUUID();
var name=req.body.name;
var description=req.body.description;
var testcases=req.body.testcases;
var expectedoutput=req.body.expectedoutput;
var problemDetails=new probModel({
pid:pid,
name:name,
description:description,
testcases:testcases,
expectedoutput:expectedoutput
});
problemDetails.save(function(err,res1){
var responseWrapper={};
if(err)
{
responseWrapper.success=false;
responseWrapper.message="some error";
res.send(responseWrapper);
return;
}
else
{
responseWrapper.success=true;
responseWrapper.message="Problem has been set successfully";
res.send(responseWrapper);
return;
}
});
});

app.post('/updatePassword',function(req,res){
var username=req.body.username;
var newpassword=req.body.newpassword;
useModel.update({username:username},{password:newpassword},function(err,affected,raw){
var responseWrapper={};
if(err)
{
responseWrapper.success=false;
responseWrapper.message=err;
res.send(responseWrapper);
return;
}
else
{
responseWrapper.success=true;
responseWrapper.message="Password has changed successfully";
res.send(responseWrapper);
return;
}
});
});

app.get('/getProblems',function(req,res){
probModel.find({},function(err,data){
if(err)
{
var responseWrapper={};
responseWrapper.success=false;
responseWrapper.message=err;
res.send(responseWrapper);
return;
}
else{
var responseWrapper={};
responseWrapper.success=true;
responseWrapper.message=data;
res.send(responseWrapper);
}
});
});


app.post('/setScore',function(req,res){
var username=req.body.username;
var score=parseInt(req.body.score);
var scoreDetails=new scrModel({
username:username,
score:score
});
scoreDetails.save(function(err,res1){
    if(err) 
    {
    var responseWrapper={};
    responseWrapper.success=false;
    responseWrapper.message=err;
    responseWrapper.code=404;
    res.send(responseWrapper);
    return;
    }
     var responseWrapper={};
     responseWrapper.success=true;
     responseWrapper.message="Score updated Successfully";
     responseWrapper.code=200;
     res.send(responseWrapper);
     return;

});
});

app.post("/updateScore",function(req,res){
var username=req.body.username;
var score=req.body.score;
scrModel.update({username:username},{score:score},function(err,affected,raw){
var responseWrapper={};
if(err)
{
responseWrapper.success=false;
responseWrapper.message=err;
res.send(responseWrapper);
return;
}
else
{
responseWrapper.success=true;
responseWrapper.message="Score has updated successfully";
res.send(responseWrapper);
return;
}


});

});
app.post("/getScore",function(req,res){
    var username=req.body.username;
   scrModel.find({username:username},function(err,data){
    if(err)
    {
    var responseWrapper={};
    responseWrapper.success=false;
    responseWrapper.message=err;
    res.send(responseWrapper);
    return;
    }
    else
    {
    var responseWrapper={};
    responseWrapper.success=true;
    responseWrapper.message=data;
    res.send(responseWrapper);
    }
    
   });

});

app.get("/getAllScore",function(req,res){
var responseWrapper={};
scrModel.find({},function(err,data){
if(err)
{
responseWrapper.success=false;
responseWrapper.message=err;
res.send(responseWrapper);
}
else
{
 responseWrapper.success=true;
 responseWrapper.message=data;
 res.send(responseWrapper);   
}

});


});

app.post('/insert',function(req,res){
    var firstname=req.body.firstname;
    var lastname=req.body.lastname;
    var username=req.body.username;
    var contactno=req.body.contactno;
    var password=req.body.password;
    var userDetails=new useModel({
    firstname:firstname,
    lastname:lastname,
    username:username,
    contactno:contactno,
    password:password
    });
 userDetails.save(function(err,res1){
    if(err) 
    {
    var responseWrapper={};
    responseWrapper.success=false;
    responseWrapper.message=err;
    responseWrapper.code=404;
    res.send(responseWrapper);
    return;
    }
     var responseWrapper={};
     responseWrapper.success=true;
     responseWrapper.message="User Added Successfully With UserName : "+username;
     responseWrapper.code=200;
     res.send(responseWrapper);
     return;
   
 });

});

app.get('/',function(req,res){
res.sendfile("login.html");
});
    
app.get('/home',function(req,res){
res.sendfile("example.html");
});

app.get('/login',function(req,res){
res.sendfile("login.html");
});

app.get('/register',function(req,res){
res.sendfile("register.html");
});
    
app.get('/index',function(req,res){
res.sendfile("index.html");
});
app.post('/compilecode' ,function(req,res){
var code=req.body.code;	
var input=req.body.input;
var inputRadio=req.body.inputRadio;
var lang=req.body.lang;
console.log(code);
if((lang==="C") || (lang==="C++"))
{ 
if(inputRadio==="true")
{    
var envData = { OS : "windows" , cmd : "g++"};	   	
compiler.compileCPPWithInput(envData , code ,input , function (data) {
if(data.error)
{
res.send(data);    		
}
else
{
res.send(data);
}
const directory="temp";
fs.readdir(directory,(ier,files)=>{
if(ier) throw ier;
for(const file of files)
{
fs.unlink(path.join(directory,file),ier=>{
if(ier) throw ier;
});
}
});

});
}
else
{
var envData={OS:"windows",cmd:"g++"};	   
compiler.compileCPP(envData,code,function(data) 
{
if(data.error)
{
res.send(data);
}    	
else
{
res.send(data);
}

const directory="temp";
fs.readdir(directory,(ier,files)=>{
if(ier) throw ier;
for(const file of files)
{
fs.unlink(path.join(directory,file),ier=>{
if(ier) throw ier;
});
}
});


});
}
}
if(lang === "Java")
{
if(inputRadio === "true")
{
var envData = { OS : "windows" };     
console.log(code);
compiler.compileJavaWithInput( envData , code , function(data){
res.send(data);
const directory="temp";
const pathtodir=path.join(__dirname,"temp");
fs.readdir(directory,(ier,files)=>{
if(ier) throw ier;
for(const file of files)
{
fs.unlink(path.join(directory,file),ier=>{
if(ier) throw ier;
});
}
});
    
});
}
else
{
var envData = { OS : "windows" };     
console.log(code);
compiler.compileJavaWithInput( envData , code , input ,  function(data){
res.send(data);
const directory="temp";
const pathtodir=path.join(__dirname,"temp");
fs.readdir(directory,(ier,files)=>{
if(ier) throw ier;
for(const file of files)
{
fs.unlink(path.join(directory,file),ier=>{
if(ier) throw ier;
});
}
});
});
}
}
if(lang === "Python")
{
if(inputRadio === "true")
{
var envData = { OS : "windows"};
compiler.compilePythonWithInput(envData , code , input , function(data){
res.send(data);
const directory="temp";
fs.readdir(directory,(ier,files)=>{
if(ier) throw ier;
for(const file of files)
{
fs.unlink(path.join(directory,file),ier=>{
if(ier) throw ier;
});
}
});
});            
}
else
{
var envData = { OS : "windows"};
compiler.compilePython(envData , code , function(data){
res.send(data);
const directory="temp";
fs.readdir(directory,(ier,files)=>{
if(ier) throw ier;
for(const file of files)
{
fs.unlink(path.join(directory,file),ier=>{
if(ier) throw ier;
});
}
});
});
}
}
if(lang === "CS")
{
if(inputRadio === "true")
{
var envData = { OS : "windows"};
compiler.compileCSWithInput(envData , code , input , function(data){
res.send(data);
const directory="temp";
fs.readdir(directory,(ier,files)=>{
if(ier) throw ier;
for(const file of files)
{
fs.unlink(path.join(directory,file),ier=>{
if(ier) throw ier;
});
}
});
});            
}
else
{
var envData = { OS : "windows"};
compiler.compileCS(envData , code , function(data){
res.send(data);
const directory="temp";
fs.readdir(directory,(ier,files)=>{
if(ier) throw ier;
for(const file of files)
{
fs.unlink(path.join(directory,file),ier=>{
if(ier) throw ier;
});
}
});

});
}
}
});

app.get('/fullstat',function(req,res){
compiler.fullstat(function(data){
res.send(data);
});
});
console.log("Server Started");
app.listen(8080);
