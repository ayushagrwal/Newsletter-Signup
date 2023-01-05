//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const https = require("https");

const app = express();

//To show static pages like style.css and logo in the website
app.use(express.static("public"));

//To get the info that user entered
app.use(bodyParser.urlencoded({extended: true}));

app.get("/",function(req,res){
    res.sendFile(__dirname + "/signup.html");
});


app.post("/",function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;

    const data = {
        members: [
            {
                email_address: email,
                status: "subscribed",
                merge_fields: {
                    FNAME: firstName,
                    LNAME: lastName
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data);

    const url = "https://us21.api.mailchimp.com/3.0/lists/a6608eb119";

    const options = {
        method: "POST",
        auth: "ayush1:f3f8423b29eb1a1a6ec68feb796f1810-us21"
    };

    const request = https.request(url, options, function(response){

        if(response.statusCode===200){
            res.sendFile(__dirname + "/success.html");
        }
        else{
            res.sendFile(__dirname + "/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        });
    });

    //Commented out to avoid unnecessary Signups on website
    request.write(jsonData);
    request.end();
});

//Request for failure screen (Try Again button is clicked)
app.post("/failure",function(req,res){
    res.redirect("/");
});


app.listen(3000,function(){
    console.log("Server is running on port 3000.");
});



//Mailchimp API Key
// f3f8423b29eb1a1a6ec68feb796f1810-us21

//List id= a6608eb119