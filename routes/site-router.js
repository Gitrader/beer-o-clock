const express = require('express');
const siteRouter = express.Router();
const isLoggedIn = require('./../middleware/isLoggedIn');


// GET              
siteRouter.get('/main', isLoggedIn, (req, res, next) => {
  res.render('main');
})

// GET               
siteRouter.get('/private', isLoggedIn, (req, res, next) => {
  res.render('private');
})

module.exports = siteRouter;