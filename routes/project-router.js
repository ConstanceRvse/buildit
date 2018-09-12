const express = require("express");

const Project = require("../models/project-model.js");

const User = require("../models/user-model.js");

const router = express.Router();

router.get("/my-projects", (req, res, next) =>{

  if(!req.user) {
    res.redirect("/login");
    return;
  }

  Project.find()
  .then(projectResults => {
    res.locals.projectArray = projectResults;
    res.render("project-views/my-projects.hbs");
  })
  .catch( err => next(err));
});

router.get("/project-details/:projectId", (req, res, next) => {

  if(!req.user) {
    res.redirect("/login");
    return;
  }

  const { projectId } = req.params;

  Project.findById(projectId)
    .then( projectDoc => {
      res.locals.projectItem = projectDoc;
      res.render("project-views/project-details.hbs");
    })
});

router.get("/categories", (req, res, next) => {

  if(!req.user) {
    res.redirect("/login");
    return;
  }
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

router.get("/templates/:projectId", (req, res, next) => {

  if(!req.user) {
    req.flash("error", "You must be logged in to see our rooms.");
    res.redirect("/login");
    return;
  }

  const { projectId } = req.params;
  Project.findById(projectId)
  .then(projectDoc => {
  // res.locals.projectId = req.params.projectId;
  res.locals.projectItem = projectDoc;
  res.render("project-views/templates.hbs");
  })
    .catch(err => next(err))
});

router.post("/colors/:projectId", (req, res, next) => {
  const { projectId } = req.params;
  const { template } = req.body;
  const changes = { template };

  if (req.body.title) {
    const { title } = req.body;
    changes.title = title;
  }

  // res.send(changes)

  Project.findByIdAndUpdate(
    projectId,
    { $set: changes },
    { runValidators: true }
  )
    .then(projectDoc => {
      res.locals.projectId = projectDoc._id;
      res.render("project-views/colors.hbs");
    })
    .catch(err => next (err));
});

router.get("/colors/:projectId", (req, res, next) => {

  if(!req.user) {
    req.flash("error", "You must be logged in to see our rooms.");
    res.redirect("/login");
    return;
  }

  res.locals.projectId = req.params.projectId;
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

router.get("/:projectId/delete", (req, res, next) => {

  if(!req.user) {
    req.flash("error", "You must be logged in to see our rooms.");
    res.redirect("/login");
    return;
  }

  const { projectId } = req.params;

  Project.findByIdAndRemove(projectId)
    .then(projectDoc => {
      res.redirect("/my-projects")
    })
    .catch(err => next(err))
})


module.exports = router;