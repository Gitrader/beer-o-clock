const mongoose = require("mongoose");
const Beer = require("./../models/beer-model");
//probab have to require user model and review as well
// remember to install punkapi on npm!

const DB_NAME = "BeerOclock"; // this shouldn't be needed but for now seeds.js isn't run anywhere else


//using punkAPI to get a starter base for our db:
const PunkAPIWrapper = require('punkapi-javascript-wrapper');
const punkAPI = new PunkAPIWrapper();

//const ourBeers = []; //empty array where we will push new items
// i put this inside getbeeres!


// STARTING HERE ....
// this will give out an array without extra properties to fit our model
function filterPunkBeerProps(punkBeerObj) {
    const ourBeer = new Beer();
    ourBeer.name = punkBeerObj.name
    ourBeer.brewery = "BrewDog"
    //ourBeer.image_url = punkBeerObj.
    ourBeers.push(ourBeer);
    console.log(ourBeer)

    //return starterBeerDB;
}
function getPunkBeers() { // will push punkBeers into our own array of beers
    const ourBeers = []; //empty array where we will push new items
    const punkBeerPr = punkAPI.getBeers();
    punkBeerPr.then(beerArray => {
        beerArray.forEach(beer => {
            console.log("beerArray object.name: ", beer.name)
            //const ourBeer = new Beer;
            //ourBeer.name = beer.name;
            //ourBeers.push(ourBeer)
            filterPunkBeerProps(beer)
            //console.log(ourBeers)
        });
        console.log("ourbeers punkbeer foraechin jälkeen:", ourBeers)
    })
    .catch(error => console.log("error seeding from punkAPI", error))

    return ourBeers
}
// ... ENDING HERE IS NOT USED ATM BUT DONT REMOVE YET

const beerList = []
function getPunks () {
    punkAPI.getBeers().then(gotbeers => {
        console.log("eka alkio gotbeersistä ", gotbeers[0])
        gotbeers.forEach(element => {
            console.log(element.name)
            beerList.push(element)
        });
        console.log("we get beers as the printout above states")
        //console.log("emptylist from inside getbeers.then block",emptyList)
        return gotbeers
    })
}



// 1. CONNECT TO MONGOOSE
mongoose.connect(
    `mongodb://localhost:27017/${DB_NAME}`,
    {useNewUrlParser: true, useUnifiedTopology: true}
    )
    .then((x) => {
        console.log(`we are Connected to DB from seeds: ${x.connections[0].name}`);
        const punkPR = getPunks()
        createDbPr = Beer.create(beerList);
        return createDbPr;
    })
    .catch((err) => console.log(err));



//console.log("synkronisesti", ourBeers)


// this works inside beerArray foreach:
// const ourBeer = new Beer;
// ourBeer.name = beer.name;
// ourBeers.push(ourBeer)
// console.log(ourBeers)

// will need a seeding function that connects our databases! beer+user + review!

// SEED SEQUENCE

// 1. CONNECT TO MONGOOSE
// mongoose.connect(
//     `mongodb://localhost:27017/${DB_NAME}`,
//     {useNewUrlParser: true, useUnifiedTopology: true}
// )
//     .then((x) => {
//         console.log(`Connected to DB: ${x.connections[0].name}`);
//         const beerPromiseArray = getPunkBeers()
//         const seedingDone = Promise.all(beerPromiseArray)
//         return seedingDone


//     })
//     .then(seedingDone => {
//         console.log("seeded beersz: ", seedingDone)

//         // 3. CLOSE THE DB CONNECTION
//         const closePr = mongoose.connection.close();
//         return closePr;
//     })
//     //.catch(error => console.log("error from seeding punkAPI", error))

//     // 2. CREATE THE DOCUMENT FROM THE ARRAY OF `books`
//     //const createBooksPr = Book.create(books);
//     //return createBooksPr;

//     .then(() => {
//         console.log('Closed the DB connection');
//     })
//     .catch((err) => console.log(err));