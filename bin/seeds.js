const mongoose = require("mongoose");
const Beer = require("./../models/beer-model");
require("dotenv").config() // require env variables
//probab have to require user model and review as well
// remember to install punkapi on npm!

// this shouldn't be needed but for now seeds.js isn't run anywhere else


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

function getBeerArray() {
    // const emptyArr
    let punkPromise = punkAPI.getBeers().then(gotbeers => {
        const beerList = []
        //console.log("eka alkio gotbeersistä ", gotbeers[0])
        gotbeers.forEach(beerObj => {
            // create a new beer based on our own model and take punkAPI beer properties to it
            let newBeer = new Beer() // remember parenthesis!
            newBeer.name = beerObj.name
            newBeer.brewery = "BrewDog"
            newBeer.image_url = beerObj.image_url
            newBeer.alcoholVol = beerObj.abv

            beerObj.ingredients.malt.forEach(malt => {
                newBeer.malt.push(malt.name)
            });
            beerObj.ingredients.hops.forEach(hops => {
                // could add here a condition that don't push if the name is already there!!!
                newBeer.hops.push(hops.name)
            });

            newBeer.EBU = beerObj.ibu // look it's actually IBU in punkbeers!
            beerList.push(newBeer)
        });
        //console.log("1st item inside our beeerlist: ",newBeer[0])
        console.log("we get beers as the printout above states")
        //console.log("emptylist from inside getbeers.then block",emptyList)
        console.log(beerList)
        return beerList // return beerList!
    })
        .catch(err => {
            console.log(err)
        })
    return punkPromise
}


function seedDatabase(beerArr) {
    const beerPromises = beerArr.map(beerObj => {
        return Beer.create({beerObj})
    });
    return beerPromises
}


// 1. CONNECT TO MONGOOSE
mongoose.connect(
    `mongodb://localhost:27017/BeerOclock`,
    {useNewUrlParser: true, useUnifiedTopology: true}
)
    .then((x) => {
        console.log(`we are Connected to DB from seeds: ${x.connections[0].name}`);
        // WARNING!! DROPPING DB TO AVOID DUPLICATES!!
        return x.connection.dropDatabase()
    }).then((y) => {
        const beerList = getBeerArray() // we are saving an array to variable beerList, right?
        console.log("list of created beers, beerList", beerList)
        return beerList // here we return a (pending) promise of getting a beer array
    })
    .then(beerList => { // if our promise was succesfully resolved, we get a beer array!
        const createDbPr = Beer.create(beerList); // creating is a promise ({} adding all?)
        return createDbPr;

    })
    .then(DBcreated => {
        console.log("created db of length: ", DBcreated.length)
    })
    .catch((err) => console.log(err));

    //in case we need these:
// // Drop the collection
// db.collection_name.drop()

// // Drop the database
// db.dropDatabase()


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