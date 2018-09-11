const express = require("express");

const Project = require("../models/project-model.js");

const User = require("../models/user-model.js");

const router = express.Router();

router.get("/my-projects", (req, res, next) =>{

  Project.find()
  .then(projectResults => {
    res.locals.projectArray = projectResults;
    res.render("project-views/my-projects.hbs");
  })
  .catch( err => next(err));
});

router.get("/project-details/:projectId", (req, res, next) => {
  const { projectId } = req.params;

  Project.findById(projectId)
    .then( projectDoc => {
      res.locals.projectItem = projectDoc;
      res.render("project-views/project-details.hbs");
    })
});

router.get("/categories", (req, res, next) => {
  res.render("project-views/categories.hbs");
});

router.post("/categories", (req, res, next) => {
  const { projectId } = req.body;

  Project.findByIdAndRemove(projectId)
    .then(projectDoc => {
      res.redirect("/categories");
    })
    .catch(err => next(err));
});

router.post("/templates", (req, res, next) => {
  const { category } = req.body;
  const owner = req.user._id;

  Project.create({ category, owner })
    .then(projectDoc => {
      res.locals.projectItem = projectDoc;
      res.render("project-views/templates.hbs");
    })
    .catch(err => next(err));
});

router.post("/colors/:projectId", (req, res, next) => {
  const { projectId } = req.params;
  const { title, template } = req.body;

  Project.findByIdAndUpdate(
    projectId,
    { $set: { title, template } },
    { runValidators: true }
  )
    .then(projectDoc => {
      res.locals.projectItem = projectDoc;
      res.render("project-views/colors.hbs");
    })
    .catch(err => next (err));
});

router.get("/colors/:projectId", (req, res, next) => {
  res.render("project-views/colors.hbs");
});

router.post("/fonts/:projectId", (req, res, next) => {
  const { projectId } = req.params;
  const { color } = req.body;

  Project.findByIdAndUpdate(
    projectId,
    { $set: { color } },
    { runValidators: true},
  )
  .then(projectDoc => {
    res.locals.projectItem = projectDoc;
    res.render("project-views/fonts.hbs");
  })
  .catch(err => next(err))
});

router.post("/project-details/:projectId", (req, res, next) => {
  const { projectId } = req.params;
  const { font } = req.body;

  Project.findByIdAndUpdate(
    projectId,
    { $set: { font } },
    { runValidators: true},
  )
  .then(projectDoc => {
    res.locals.projectItem = projectDoc;
    res.render("project-views/project-details.hbs");
  })
  .catch(err => next(err))
});



module.exports = router;