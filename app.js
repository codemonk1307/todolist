//jshint esversion:6

// require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const date = require(__dirname + "/date.js");
const _ = require("lodash");
// const encrypt = require("mongoose-encryption");

const app = express();
// console.log(process.env.API_KEY);

// most important step to make your script to view from list.ejs file using view engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

mongoose.connect("mongodb+srv://admin:rocket@13@cluster0.g8kjp.mongodb.net/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false });

//mongoose schema
const itemsSchema = {
    name : String
};


// itemsSchema.plugin(encrypt, {secret : process.env.SECRET});

//mongoose model
const Item = mongoose.model("Item", itemsSchema); 

//mongoose documents
const item1 = new Item({
    name : "Wake Up"
});

const item2 = new Item({
    name : "Drink Water :-)"
});

const item3 = new Item({
    name : "Do Excersize !"
});

const defaultItems = [item1, item2, item3];

const listSchema = {
  name: String,
  items: [itemsSchema]
};

const List = mongoose.model("List", listSchema);

app.get("/", function (req, res) {

  const day = date.getDate();

  Item.find({}, function (err, foundItems) {

    if (foundItems.length === 0) {
      Item.insertMany(defaultItems, function (err) {
        if (err) {
          console.log(err);
        } else {
          console.log("Saved your default items to the Database successfully!!")
        }
      });
      res.redirect("/");
    } else {
      res.render("list", { listTitle: day, newListItems: foundItems});
    }

  });

}); 

app.get("/:customListName", function(req, res){
  // console.log(req.params.customListName)
  const customListName = _.capitalize(req.params.customListName);

  List.findOne({ name: customListName}, function(err, foundList){
    if (err){
      console.log(err);
    } else {
      if (!foundList){
        // console.log("Your Custom List", customListName, "doesn't exists");
        // Create a new list
        const list = new List({
          name: customListName,
          items: defaultItems
        });
      
        list.save();
        res.redirect("/" + customListName);
      } else{
        // console.log("Your custom list is :- ", customListName)
        // show an existing list 
        res.render("list", {listTitle: foundList.name, newListItems: foundList.items});
      }
    }
  });

  // res.redirect("/:customListName");
});

// app.get("/work", function (req, res) {
//   res.render("list", { listTitle: "Work List", newListItems: workItems });
// });

app.post("/", function (req, res) {

  const itemName = req.body.newItem;
  const listName = req.body.list;

  const item = new Item({
    name: itemName
  });

  if (listName === date.getDate()){
    item.save();
    console.log("Successfully added the", itemName, "task to your", listName, "to-do list");
    res.redirect("/");
  } else {
    List.findOne({name: listName}, function(err, foundList){
      foundList.items.push(item);
      foundList.save();
      console.log("Successfully added the", itemName, "task to your", listName, "to-do list");
      res.redirect("/" + listName);
    });
  }
  // if (req.body.list === "Work") {
  //   workItems.push(item);
  //   res.redirect("/work");
  // } else {
  //   items.push(item);
  //   res.redirect("/");
  // }
});

app.post("/delete", function (req, res) {
  // console.log(req.body.checkbox);

  const checkedItemId = req.body.checkbox;
  const listName = req.body.listName;

  if (listName === date.getDate()) {
    Item.findByIdAndRemove(checkedItemId, function (err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted the completed task from your", listName, "to-do list");
        res.redirect("/");
      }
    });
  } else {
    List.findOneAndUpdate({ name: listName }, { $pull: { items: { _id: checkedItemId } } }, function (err, foundList) {
      if (err) {
        console.log(err);
      } else {
        console.log("Successfully deleted the completed task from your", listName, "to-do list");
        res.redirect("/" + listName);
      }
    });
  }
});

app.get("/about", function (req, res) {
  res.render("about");
});

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.listen(port, function () {
  console.log("Server started on port", port, "successfully :-) !");
});






// app.get("/", function(req, res){
    //     //   res.send("Hello");
    
    //     const today = new Date();
    
    //     const options = {
    //         weekday : "long",
    //         day : "numeric",
    //         month : "long"
    //     };
    
    //     const day = today.toLocaleDateString("en-US", options);
    
    //     res.render("list", {detailsOfDay : day, newListItems: items});  
    
    // });
    
    // app.post("/", function(req, res){
    //     const item = req.body.newItem;
    
    //     items.push(item);
    
    //     // console.log(item);
    //     res.redirect("/");
    
    // });
    




// const currentDay = today.getDay();
    // const day = "";

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