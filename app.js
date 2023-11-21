const express = require("express");
const app = express();
var cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
var path = require("path");
var ejs = require("ejs");
const userModel = require("./public/models/users");
const mailModel = require("./public/models/mails");

app.use(cookieParser("salt for cookie"));

let mails = [];
let currUser;

app.listen(1500, () => {
  console.log("Your Server is running on 3000");
});

mongoose.connect(
  "mongodb+srv://khangai:khangai@cluster0.sguv11w.mongodb.net/?retryWrites=true&w=majority",
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));
db.once("open", () => {
  console.log("Connected to MongoDB");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + "/public"));
//EJS Engine
app.set("view engine", "html");
app.engine("html", ejs.renderFile);

app.get("/", function (req, res, next) {
  if (req.cookies && req.cookies.user) {
    res.render("index", { mails: mails, user: req.cookies.user });
  } else {
    res.redirect("/login");
  }
});

app.get("/login", function (req, res, next) {
  if (req.cookies.user) {
    res.redirect("/");
  } else {
    res.render("login", { error: "" });
  }
});

app.post("/login", async function (req, res, next) {
  try {
    const user = await userModel.find({
      username: req.body.username,
      password: req.body.password,
    });
    if (user.length == 0) {
      res.render("login", { error: "No User Found" });
    } else {
      currUser = user[0].username;
      res.cookie("user", user);
      res.redirect("/getAllMails");
    }
  } catch (error) {
    console.log(error);
    response.status(500).send(error);
  }
});

app.get("/getAllMails", async function (req, res, next) {
  try {
    if (currUser) {
      mails = await mailModel.find({ to: currUser }).sort({date: -1});
      console.log("sdaaaa", mails);
      res.redirect("/");
    } else {
      res.redirect("/login");
    }
  } catch (error) {
    console.log(error);
    res.status(500).send(error);
  }
});

app.post("/sendEmail", async function (req, res, next) {
  console.log(req.body);
  let newMail = new mailModel(req.body);
  try {
    await newMail.save();
    res.redirect("/getAllMails");
  } catch (error) {
    res.status(500).send(error);
  }
});


app.get("/singleMail/:id", async function(req,res,next) {
    try {
        const user = await mailModel.find({
            _id: req.params.id,
          });
          console.log(user[0]);
          res.send(user[0])
    } catch (error) {
      res.status(500).send(error);
    }
})