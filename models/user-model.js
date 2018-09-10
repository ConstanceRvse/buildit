const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema ({
  // document structure & rules
  fullName: { type: String, required: true },
  email: {
    type: String,
    required: true,
    unique: true,
    match: /^.+@.+\..+$/
  },
  encryptedPassword: { type: String, minlength: 8 },
}, {
  // additional settings for Schema constructor
  timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;