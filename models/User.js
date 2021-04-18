// Importer Mongoose
const mongoose = require("mongoose");

// Création du modèle
const User = mongoose.model("User", {
  email: {
    unique: true,
    type: String,
  },
  account: {
    username: { required: true, type: String },
    name: { required: true, type: String },
    description: { required: true, type: String },
    avatar: { type: Object, default: {} },
  },
  hash: String,
  salt: String,
  token: String,
});

// Export du modèle
module.exports = User;
