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

router.post("/process-choose-category", (req, res, next) => {
  const { category } = req.body;
  const owner = req.user._id;

  Project.create({ category, owner })
    .then(projectDoc => {
      res.redirect("/templates");
    })
    .catch(err => next(err));
});

router.post("/process-choose-template", (req, res, next) => {
  const { title, template } = req.body;

  Project.findByIdAndUpdate(
    req.project._id,
    { $set: { title, template } },
    { runValidators: true },
  )
    .then(projectDoc => {
      res.redirect("/colors");
    })
    .catch(err => next(err));
});

router.get("/colors", (req, res, next) => {
  res.render("project-views/colors.hbs");
});

router.get("/templates", (req, res, next) => {
  res.render("project-views/templates.hbs");
});

module.exports = router;