const express = require("express");

const Project = require("../models/project-model.js");

const User = require("../models/user-model.js");

const router = express.Router();

router.get("/my-projects", (req, res, next) =>{
  res.render("project-views/my-projects.hbs");
});

router.get("/categories", (req, res, next) => {
  res.render("project-views/categories.hbs");
});

module.exports = router;