# Codify
Codify is an Online Competetitive Coding Platform.It Provides List of Algorithmic Challanges.A User has to some Predefined testcases regarding any problem and according 
to his Program output he will be rewarded with some points if his program passes all the required testcases of a particular challenge.User can see their score on the leaderboard and Unlock and view any code challange.A user can also change the theme of Code Editor and Editor will highlight the code syntax for a selected programming language,also code will be loaded into database whenever user will submit his code,There is a module for plagiarism detection whenever user copy someones code among different users,User will be warned with "Plagiarized Content Message";
Tools and Technologies Used 
Front End:Html,JavaScript,Ace JS(Plugin for theme and code editor(Check https://ace.c9.io/)).
Back End :Express JS(Server),Compilex Framework(Code Checker in JS),MongoDB and Mongoose(to Store Data in JSON Format)

Working : Install Necessary Packages like fn,path,body-parser,mongoose,mongodb,express,compilex,similarity(used for plagiarism detection using text similarity)express-session Using npm(node package manager) tool.
Start Express Server for this type node server.js in terminal(server.js contains code of express server)
Some important Urls that you can type in your broswer to do specific tasks related to any activity:
http://localhost:8080/ or http://localhost:8080/login(login with codify platform)
http://localhost:8080/register(to register with codify platform)
http://localhost:8080/openProblemSetter(to set any problem)
http://localhost:8080/home (Main Page of Codify remember any single can't directly use this url first he has to logged in)


Demo :https://youtu.be/boER86GimaA
