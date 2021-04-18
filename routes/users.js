// Importer Express et utiliser le Router
const express = require("express");
const router = express.Router();

// Importer UID2, SHA 256, encBase264
const uid2 = require("uid2");
const SHA256 = require("crypto-js/sha256");
const encBase264 = require("crypto-js/enc-base64");

// Importer les models
const User = require("../models/User");

// Création des routes

// Création d'une route POST SIGNUP
router.post("/user/sign_up", async (req, res) => {
  try {
    const { email, password, username, name, description, avatar } = req.fields;
    // Vérification si tous les champs ont bien été renseignés
    if (email && password && username && name && description) {
      // Vérification si un compte n'est pas déjà existant dans la BDD avec le même email et username
      const userExist = await User.findOne({ email: email });
      const usernameExist = await User.findOne({
        "account.username": username,
      });
      if (!userExist) {
        if (!usernameExist) {
          const saltUser = uid2(16);
          const newUser = new User({
            email: email,
            account: {
              username: username,
              name: name,
              description: description,
              avatar: avatar,
            },
            salt: saltUser,
            hash: SHA256(password + saltUser).toString(encBase264),
            token: uid2(64),
          });
          await newUser.save();
          res.status(200).json({
            message: "Votre compte a été créé avec succès !",
            id: newUser.id,
            account: newUser.account,
            token: newUser.token,
          });
        } else {
          res.status(400).json({ message: "This username already exist." });
        }
      } else {
        res.status(400).json({ message: "This email already has an account." });
      }
    } else {
      res.status(400).json({ message: "Missing parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Création d'une route POST LOGIN
router.post("/user/log_in", async (req, res) => {
  try {
    const { email, password } = req.fields;
    if (email && password) {
      const userExist = await User.findOne({ email: email });
      if (userExist) {
        if (
          userExist.hash ===
          SHA256(password + userExist.salt).toString(encBase264)
        ) {
          res.status(200).json({
            id: userExist.id,
            email: userExist.email,
            account: userExist.account,
            token: userExist.token,
          });
        } else {
          res.status(400).json({ error: "Unauthorized" });
        }
      } else {
        res.status(400).json({ error: "Unauthorized" });
      }
    } else {
      res.status(400).json({ message: "Missing parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Exporter le router
module.exports = router;
