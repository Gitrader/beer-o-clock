const express = require("express");
const siteRouter = express.Router();
const Beer = require("./../models/beer-model");
const isLoggedIn = require("./../middleware/isLoggedIn");
const parser = require("./../config/cloudinary");

require("dotenv").config();

// GET
siteRouter.get("/all-beers", isLoggedIn, (req, res, next) => {
  res.render("all-beers");
});

// GET
siteRouter.get("/beer-description", isLoggedIn, (req, res, next) => {
  res.render("beer-description");
});

// GET
siteRouter.get("/add-beer", isLoggedIn, (req, res, next) => {
  res.render("add-beer");
});

// POST
siteRouter.post(
  "/add-beer",
  isLoggedIn,
  parser.single("image_url"),
  (req, res, next) => {
    // thanks to multer, you have now access to the new object "req.file"
    const {
      authorId,
      name,
      //   beer_image_url,
      beerType,
      brewery,
      alcoholVol,
      country,
      description,
      malt,
      hops,
      EBU,
      purchasePlace,
      purchaseCountry,
    } = req.body;
    // get the image URL to save it to the database and/or render the image in your view
    const beer_image_url = req.file.secure_url;

    const newBeer = {
      authorId,
      name,
      image_url: beer_image_url,
      beerType,
      brewery,
      alcoholVol,
      country,
      description,
      malt,
      hops,
      EBU,
      purchasePlace,
      purchaseCountry,
    };
    Beer.create(newBeer)
      .then((data) => {
        res.redirect("all-beers");
      })
      .catch((err) => console.log(err));
  }
);

siteRouter.get("/add-review", isLoggedIn, (req, res, next) => {
  res.render("add-review");
});

// GET
siteRouter.get("/favorite-beers", isLoggedIn, (req, res, next) => {
  res.render("favorite-beers");
});

// GET
siteRouter.get("/profile/profile-page", isLoggedIn, (req, res, next) => {
  res.render("profile/profile-page");
});

// GET
siteRouter.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private");
});

module.exports = siteRouter;
