const express= require("express");
const bodyParser= require("body-parser");
const https=require("https");
const { request } = require("http");

const app=express();
app.use(bodyParser.urlencoded({extended:true}));
// app.use(express.static(__dirname+"/static"));
app.use(express.static("static"));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    const fName=req.body.fName;
    const lName= req.body.lName;
    const email= req.body.email;
    const data={
       members:[
        {
            email_address:email,
            status:"subscribed",
            merge_fields:{
                FNAME:fName,
                LNAME:lName
            }
        }
       ]
    };
    const jsonData= JSON.stringify(data);

    const url="https://us9.api.mailchimp.com/3.0/lists/f76e9d849d";
    const options={
        method:"POST",
        auth:"temp:d6cf56c39b3afecb6603d536fa8f95f2-us9"
    };
    const request=https.request(url, options, (response) => {
        if(response.statusCode===200)
        {
            res.sendFile(__dirname+"/success.html");
        }else{
            res.sendFile(__dirname+"/failure.html");
        }
        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    });
    request.write(jsonData);
    request.end();

});

app.post("/failure", function(req,res){
    res.redirect("/");
});

app.listen("3000",function(){
    console.log("Server up and running on port 3000");
})

/*
    API Key- d6cf56c39b3afecb6603d536fa8f95f2-us9
    Audience Id -  f76e9d849d
*/


