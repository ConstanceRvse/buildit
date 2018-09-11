const express = require("express");

const Project = require("../models/project-model.js");

const User = require("../models/user-model.js");

const router = express.Router();

// router.get("/my-projects", (req, res, next) =>{
//   res.render("project-views/my-projects.hbs");
// });

router.get("/my-projects", (req, res, next) =>{

  Project.find()
  .then(projectResults => {
    res.locals.projectArray = projectResults;
    res.render("project-views/my-projects.hbs");
  })
  .catch( err => next(err));
});

router.get("/categories", (req, res, next) => {
  res.render("project-views/categories.hbs");
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
      res.render("project-views/colors.hbs");
    })
    .catch(err => next (err));
});


module.exports = router;