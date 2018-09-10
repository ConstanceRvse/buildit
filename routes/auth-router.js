const express = require("express");
const bcrypt = require("bcrypt");
const passport = require("passport");

const User = require("../models/user-model.js");

const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
  const { fullName, email, originalPassword } = req.body;

  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);

  User.create({ fullName, email, encryptedPassword })
    .then(userDoc => { 
      req.flash("success", "Sign up success! 👏");
      res.redirect("/")
    })
    .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { email, originalPassword } = req.body;

  // first check to see if there's a document with that email
  User.findOne({ email: { $eq: email } })
  .then(userDoc => {
    // "userDoc" will be empty if the email is wrong (no document in the DB)
    if(!userDoc){
      // save a flash message to display in the LOGIN page
      req.flash("error", "Incorrect email. ☠️")
      res.redirect("/login");
      return; // use return instead of a big else
    }
   
    // second check the password
    const { encryptedPassword } = userDoc;
    // compareSync() will return false if the originalPassword is wrong
    if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.flash("error", "Password is wrong! 🔐")
        res.redirect("/login");
        return;
    }
    // save the user ID in the session
    // req.logIn() is a passport method that triggers "serializeUser()"
    // that saves the USER ID in the session
    req.logIn(userDoc, () => {
      req.flash("success", "Log in success! 👍")
      // go to the home page if the password is Good
      res.redirect("/");
    });
  })
  .catch(err => next(err));
});

module.exports = router;