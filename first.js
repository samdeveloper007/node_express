var express= require('express');
var bodyparser= require('body-parser');
var cookieParser= require('cookie-parser');
var session= require('express-session');
const { redirect } = require('express/lib/response');
var app= express();
app.use(bodyparser.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({secret: "Shh, its a secret!"}));
app.listen("3000", function(req, res){
    console.log("server started!");
});
app.get("/", function(req, res){
    if(req.session.login_failed >= 5){
        res.send("You are blocked!!!");
    }else if(req.session.login_succes === 1){
        res.redirect('/home');
    }
    else{
        var curr_dir= __dirname;
        res.sendFile(__dirname+'/'+'login.html');
    }
});
app.post("/", function(req, res){
    var username= req.body.username;
    var password= req.body.password;
    // res.send(password);
    if (username=='admin' && password=='12345') {
        // res.send("Login successful");
        // res.sendFile(__dirname+'/'+'index.html');
        req.session.login_succes= 1;
        res.redirect('/home');
    }
    else{
        if(req.session.login_failed){
            if(req.session.login_failed >= 5){
                res.send("You are blocked!!!");
            }else{
                req.session.login_failed += 1;
                res.send("Login failed!");
            }
        }
        else{
            req.session.login_failed= 1;
            res.send("Login failed!");
        }
    }
    
});
app.get('/home', function(req, res) {
    if(req.session.login_succes === 1){
        res.sendFile(__dirname+'/'+'index.html');
    }else{
        res.redirect('/');
    }
    
});
app.get('/logout', function(req, res){
    req.session.login_succes=0;
    res.redirect('/');
});