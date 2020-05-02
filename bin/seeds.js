const mongoose = require("mongoose");
const Beer = require("./../models/beer-model");
//probab have to require user model and review as well
// remember to install punkapi on npm!


//using punkAPI to get a starter base for our db:
const PunkAPIWrapper = require('punkapi-javascript-wrapper');
const punkAPI = new PunkAPIWrapper();

const getPunkBeers = punkAPI.getBeers();
getPunkBeers.then(beerArray => {
    beerArray.forEach(beer => {
        //console.log("beerArray object: ", beer)

    });
})
    .catch(error => console.log("error from seeding punkAPI", error))

    // this will give out an array without extra properties to fit our model
function filterPunkBeerProps (beerlist) {
    const starterBeerDB = [];
    beerlist.forEach(beerObj => {
        //const newBeer = new Beer
        //beerObj.name
    });
}

// will need a seeding function that connects our databases! beer+user + review!