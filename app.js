//jshint esversion:6
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");

const app = express();

mongoose.connect("mongodb://localhost:27017/userDB", { useNewUrlParser: true });

const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

const User = new mongoose.model("User", userSchema);

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

app.route("/").get((req, res) => {
  res.render("home");
});

app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post(async (req, res) => {
    try {
      const username = req.body.username;
      const password = req.body.password;
      const foundUser = await User.findOne({
        email: username,
        password: password,
      });
      if (foundUser) {
        if (foundUser.password === password) {
          res.render("secrets");
        }
      }
    } catch (err) {
      console.log(err);
    }
  });

app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post(async (req, res) => {
    try {
      const newUser = new User({
        email: req.body.username,
        password: req.body.password,
      });
      await newUser.save();
      res.render("secrets");
    } catch (err) {
      console.log(err);
    }
  });

app.listen(3000, () => {
  console.log("Server started on port 3000");
});
