const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const projectSchema = new Schema ({
  title: {type: String, required: true},
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

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;