// Importer mongoose
const mongoose = require("mongoose");

// Créer le Model
const Room = mongoose.model("Room", {
  title: { required: true, type: String },
  description: { required: true, type: String },
  price: { required: true, type: Number },
  location: {
    lat: { required: true, type: Number },
    lng: { required: true, type: Number },
  },
  photos: { type: Array, default: [] },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

// Exporter le Model
module.exports = Room;
