const express = require("express");
const siteRouter = express.Router();
const isLoggedIn = require("./../middleware/isLoggedIn");

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
