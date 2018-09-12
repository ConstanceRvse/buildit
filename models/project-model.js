const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema ({
  title: { type: String, default: "My Website", },
  category: {
    type: String,
    enum: ["blog", "ecommerce", "portfolio", "corporate"] 
  }, 
  image: { type: String },
  template: { type: String },
  color: { type: String },
  font: { type: String },
  owner: {
    type: Schema.Types.ObjectId,
    ref: "User", 
    required: true,
  },
}, {
  timestamps: true
});

projectSchema.virtual("blog").get(function () {
  return this.category === "blog";
});

projectSchema.virtual("ecommerce").get(function () {
  return this.category === "ecommerce";
});

projectSchema.virtual("portfolio").get(function () {
  return this.category === "portfolio";
});

projectSchema.virtual("corporate").get(function () {
  return this.category === "corporate";
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;