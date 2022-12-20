require("dotenv").config();

const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const ejs = require("ejs");
const mongoose = require("mongoose");
const encrypt = require("mongoose-encryption");

const port = 3000;

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

mongoose.set("strictQuery", true);
mongoose.connect("mongodb://127.0.0.1/userDB", { useNewUrlParser: true });

// ===========================================================================

// SCHEMA USER
const userSchema = new mongoose.Schema({
  email: String,
  password: String,
});

// encrypt
userSchema.plugin(encrypt, {
  secret: process.env.SECRET,
  encryptedFields: ["password"],
});

// MODEL USER
const User = new mongoose.model("User", userSchema);

app.get("/", (req, res) => {
  res.render("home");
});

// login route
app
  .route("/login")
  .get((req, res) => {
    res.render("login");
  })
  .post((req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email: email }, (err, result) => {
      if (err) {
        console.log(err);
      } else {
        if (result) {
          if (result.password === password) {
            res.render("secrets");
          }
        }
      }
    });
  });

// register route
app
  .route("/register")
  .get((req, res) => {
    res.render("register");
  })
  .post((req, res) => {
    const newUser = new User({
      email: req.body.email,
      password: req.body.password,
    });

    newUser.save((err) => {
      if (err) {
        console.log(err);
      } else {
        res.render("secrets");
      }
    });
  });

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});
