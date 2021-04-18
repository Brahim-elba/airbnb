// Installation et import des packages Express, Express-Formidable, Mongoose, UID2, Crypto-js, Cors et Helmet
const express = require("express");
const expressFormidable = require("express-formidable");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
require("dotenv").config();

// Initialiser le serveur et utiliser expressFormidable
const app = express();
app.use(expressFormidable());
app.use(cors());

// Créer et connecter le serveur à la base de données Mongoose
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

// Importer les routes
const userRoutes = require("./routes/users");
app.use(userRoutes);

// Créer une requête vers les routes inexistantes
app.all("*", (req, res) => {
  res.status(404).json("Il n'y a rien par là l'ami !");
});

app.listen(process.env.PORT, () => {
  console.log("Server started ! 😎");
});
