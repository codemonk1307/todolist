//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");

const app = express();

var items = ["Wake Up", "Drink Water", "Do Excersize"];

// most important step to make your script to view from list.ejs file using view engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
    //   res.send("Hello");


    var today = new Date();

    var options = {
        weekday : "long",
        day : "numeric",
        month : "long"
    };

    var day = today.toLocaleDateString("en-US", options);

    res.render("list", {detailsOfDay : day, newListItems: items});  

});

app.post("/", function(req, res){
    var item = req.body.newItem;

    items.push(item);

    // console.log(item);
    res.redirect("/");

});

app.listen(3000, function(){
  console.log("Server started on port 3000.");
});






// var currentDay = today.getDay();
    // var day = "";

    // longer methods boring and also infeasible too 

    // if (today.getDay() === 6 || today.getDay() === 0 ){
    //     res.send("yuppiee its weekend!! parrii ho rahi hai");

    // }  else{
    //     res.send("Shitt working day!!! kaam karna pdega!! :-(");
    // }

    // if (today.getDay() === 6 || today.getDay() === 0 ){
    //     res.write("yuppiee its weekend!! parrii ho rahi hai");
    //     res.send();

    // }  else{
    //     res.write("<h1> Shitt working day!!! kaam karna pdega!! :-( </h1>");
    //     res.write("<h1> Shitt working day!!! kaam karna pdega!! :-( </h1>");
    //     res.write("Shitt working day!!! kaam karna pdega!! :-(");
    //     res.send();
    // }

    // if (today.getDay() === 6 || today.getDay() === 0 ){
    //     res.write("yuppiee its weekend!! parrii ho rahi hai");
    //     res.send();

    // }  else{
    //     res.sendFile(__dirname + "/index.html");
    // }


    // if (currentDay === 6 || currentDay === 0){
    //     day = "Weekend  :-) ";
    // } else{
    //     day = "Working day :-( ";
    // }

    // res.render("list", {detailsOfDay : day});


    // switch(currentDay){
    //     case 0:
    //         day = "Sunday";
    //         break;
    //     case 1:
    //         day = "Monday";
    //         break;
    //     case 2:
    //         day = "Tuesday";
    //         break;
    //     case 3:
    //         day = "Wednesday";
    //         break;
    //     case 4:
    //         day = "Thrusday";
    //         break;
    //     case 5:
    //         day = "Friday";
    //         break;
    //     case 6:
    //         day = "Saturday";
    //         break;
        
    //     default:
    //         console.log("You entered the invalid week day which is :" + currentDay);
    // }

    // res.render("list", {detailsOfDay : day});