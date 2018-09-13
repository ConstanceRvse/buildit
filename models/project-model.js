const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema ({
  title: { type: String, default: "My Website", },
  category: {
    type: String,
    enum: ["Blog", "Ecommerce", "Portfolio", "Corporate"] 
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

projectSchema.virtual("Blog").get(function () {
  return this.category === "Blog";
});

projectSchema.virtual("Ecommerce").get(function () {
  return this.category === "Ecommerce";
});

projectSchema.virtual("Portfolio").get(function () {
  return this.category === "Portfolio";
});

projectSchema.virtual("Corporate").get(function () {
  return this.category === "Corporate";
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;