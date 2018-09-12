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
      //req.flash("success", "Sign up success! 👏");
      res.redirect("/my-projects");
    })
    .catch(err => next(err));
});

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { email, originalPassword } = req.body;

  User.findOne({ email: { $eq: email } })
  .then(userDoc => {
    if(!userDoc){
      req.flash("error", "Incorrect email or password.");
      res.redirect("/login");
      return; 
    }

    const { encryptedPassword } = userDoc;

    if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.flash("error", "Incorrect email or password.");
        res.redirect("/login");
        return;
    }

    req.logIn(userDoc, () => {
      //req.flash("success", "Logged in successfully! 👍")
      res.redirect("/");
    });
  })
  .catch(err => next(err));
});

router.get("/logout", (req, res, next) => {
  req.logOut();
  //req.flash("success", "Logged out successfully");
  res.redirect("/");
});

router.get("/google/login",
  passport.authenticate("google", {
    scope: [
      "https://www.googleapis.com/auth/plus.login",
      "https://www.googleapis.com/auth/plus.profile.emails.read",
    ]
}));

router.get("/google/user-info",
passport.authenticate("google", {
  successRedirect: "/",
  successFlash: "Google log in successful!",
  failureRedirect: "/login",
  failureFlash: "Google log in failed!"
}));

module.exports = router;