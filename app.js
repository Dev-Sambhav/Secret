require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const _ = require("loadsh");
const ejs = require("ejs");
const encrypt = require("mongoose-encryption");
const mongoose = require("mongoose");
port = process.env.PORT || 3000;
const app = express();
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));
mongoose.connect("mongodb://localhost:27017/userDB", {
  useNewUrlParser: true,
});
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

userSchema.plugin(encrypt, {
  secret: process.env.SECRET_KEY,
  encryptedFields: ["password"],
});
const User = mongoose.model("User", userSchema);
app.get("/", (req, res) => {
  res.render("home");
});
app.get("/register", (req, res) => {
  res.render("register");
});
app.post("/register", (req, res) => {
  const newUser = new User({
    email: req.body.username,
    password: req.body.password,
  });
  newUser.save((err) => {
    if (!err) {
      res.render("secrets");
    } else {
      console.log(err);
    }
  });
});
app.get("/login", (req, res) => {
  res.render("login");
});
app.post("/login", (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  User.findOne({ email: username }, (err, foundRecord) => {
    if (err) {
      console.log(err);
    } else {
      if (foundRecord) {
        if (password === foundRecord.password) {
          res.render("secrets");
        } else {
          console.log("Invalid Password");
        }
      } else {
        console.log("Invalid Username");
      }
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on Port ${port}`);
});
