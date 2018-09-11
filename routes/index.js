const express = require('express');
const router  = express.Router();
const User = require("../models/user-model.js");

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});

router.get("/settings", (req, res, next) => {
  if(!req.user){
    req.flash("error", "you have to be logged to visit User Settings!");
    res.redirect("/login");
  } else {
    res.render("settings.hbs");
  }
})

router.post("/process-settings", (req, res, next) => {
  const{ fullName, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,  
    { $set: { fullName, email } },
    { runValidators: true },
  )
  .then(userDoc => {
    req.flash("success", "settings saved!");
    res.redirect("/");
  })
  .catch(err => next(err));
});

module.exports = router;
