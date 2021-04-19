// Importer Express et utiliser le router
const express = require("express");
const router = express.Router();

// Importer les models
const User = require("../models/User");
const Room = require("../models/Room");
const isAuthenticated = require("../middlewares/isAuthenticated");

// Créer les routes

// Création d'une route POST pour publier une annonce
router.post("/room/publish", isAuthenticated, async (req, res) => {
  try {
    const { title, description, price, location } = req.fields;
    // Vérification de la présence de tous les champs
    if (title && description && price && location.lat && location.lng) {
      // Vérification si le contenu des champs est au bon format
      if (
        typeof title === "string" &&
        typeof description === "string" &&
        typeof price === "number" &&
        typeof location.lat === "number" &&
        typeof location.lng === "number"
      ) {
        const newRoom = new Room({
          title: title,
          description: description,
          price: price,
          location: location,
          owner: req.user,
        });
        await newRoom.save();
        res.status(200).json({
          title: newRoom.title,
          description: newRoom.description,
          price: newRoom.price,
          location: newRoom.location,
          photos: newRoom.photos,
          owner: { id: newRoom.owner.id },
        });
      } else {
        res.status(400).json({ message: "Please enter in the correct format" });
      }
    } else {
      res.status(400).json({ message: "Missing parameters" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Création d'une route GET pour lire toutes les annonces
router.get("/rooms", async (req, res) => {
  try {
    const roomsFind = await Room.find().select("-owner -description -__v");
    if (roomsFind.length > 0) {
      res.status(200).json(roomsFind);
    } else {
      res.status(400).json({ message: "No rooms find !" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Création d'une route GET pour lire une seule annonce grâce à son ID
router.get("/rooms/:id", async (req, res) => {
  try {
    const roomFind = await Room.findById(req.params.id).populate(
      "owner",
      "account"
    );
    if (roomFind) {
      res.status(200).json(roomFind);
    } else {
      res.status(400).json({ message: "No room find with this ID !" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Création d'une route PUT pour modifier l'annonce grâce à son ID
router.put("/rooms/update/:id", isAuthenticated, async (req, res) => {
  try {
    const { title, description, price, location } = req.fields;
    const roomToUpdate = await Room.findById(req.params.id).populate("owner");
    if (roomToUpdate) {
      // Vérification que l'utilisateur est bien le propriétaire de l'annonce
      if (req.user.token === roomToUpdate.owner.token) {
        // Vérification qu'au moins un champ a été saisi
        if (title || description || price || location) {
          if (title) {
            roomToUpdate.title = title;
          }
          if (description) {
            roomToUpdate.description = description;
          }
          if (price) {
            roomToUpdate.price = price;
          }
          if (location) {
            roomToUpdate.location = location;
          }
          await roomToUpdate.save();
          res.status(200).json({
            title: roomToUpdate.title,
            description: roomToUpdate.description,
            price: roomToUpdate.price,
            location: roomToUpdate.location,
            photos: roomToUpdate.photos,
            owner: { id: roomToUpdate.owner.id },
          });
        } else {
          res.status(401).json({ message: "Please, enter one parameter" });
        }
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.status(400).json({ message: "No room find with this ID !" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Création d'une route DELETE pour supprimer l'annonce grâce à son ID
router.delete("/rooms/delete/:id", isAuthenticated, async (req, res) => {
  try {
    const roomToDelete = await Room.findById(req.params.id).populate("owner");
    if (roomToDelete) {
      if (req.user.token === roomToDelete.owner.token) {
        await roomToDelete.delete();
        res.status(200).json({ message: "Room deleted" });
      } else {
        res.status(401).json({ error: "Unauthorized" });
      }
    } else {
      res.status(400).json({ message: "No room find with this ID !" });
    }
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Exporter le router
module.exports = router;
