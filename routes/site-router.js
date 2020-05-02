const express = require('express');
const siteRouter = express.Router();
const isLoggedIn = require('./../middleware/isLoggedIn');


// GET              
siteRouter.get('/all-beers', isLoggedIn, (req, res, next) => {
  res.render('all-beers');
})

// GET               
siteRouter.get('/private', isLoggedIn, (req, res, next) => {
  res.render('private');
})

module.exports = siteRouter;

