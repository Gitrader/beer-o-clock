const mongoose = require("mongoose");
const Beer = require("./../models/beer-model");
require("dotenv").config(); // require env variables
//probab have to require user model and review as well
// remember to install punkapi on npm!

//using punkAPI to get a starter base for our db:
const PunkAPIWrapper = require("punkapi-javascript-wrapper");
const punkAPI = new PunkAPIWrapper();

function getBeerArray() {
  // const emptyArr
  let punkPromise = punkAPI
    .getBeers()
    .then((gotbeers) => {
      const beerList = [];
      //console.log("eka alkio gotbeersistä ", gotbeers[0])
      gotbeers.forEach((beerObj) => {
        // create a new beer based on our own model and take punkAPI beer properties to it
        let newBeer = new Beer(); // remember parenthesis!
        newBeer.name = beerObj.name;
        newBeer.brewery = "BrewDog";
        newBeer.image_url = beerObj.image_url;
        newBeer.alcoholVol = beerObj.abv;

        beerObj.ingredients.malt.forEach((malt) => {
          if (newBeer.malt.includes(malt.name)) {
            // dont do anythig
          } else {
            newBeer.malt.push(malt.name);
          }
        });
        beerObj.ingredients.hops.forEach((hops) => {
          // could add here a condition that don't push if the name is already there!!!
          if (newBeer.hops.includes(hops.name)) {
            // dont do anythig
          } else {
            newBeer.hops.push(hops.name);
          }
        });

        newBeer.EBU = beerObj.ibu; // look it's actually IBU in punkbeers!
        newBeer.brewery = "BrewDog"
        newBeer.country = "Scotland"
        beerList.push(newBeer);
      });
      //console.log("1st item inside our beeerlist: ",newBeer[0])
      console.log("we get beers as the printout above states");
      //console.log(beerList);
      return beerList; // return beerList!
    })
    .catch((err) => {
      console.log(err);
    });
  return punkPromise;
}

// 1. CONNECT TO MONGOOSE
mongoose.connect(
  `mongodb://localhost:27017/BeerOclock`,
  {useNewUrlParser: true, useUnifiedTopology: true}
)// 2. find our DB
  .then((x) => {
    console.log(`we are Connected to DB from seeds: ${x.connections[0].name}`);
    // WARNING!! DROPPING DB TO AVOID DUPLICATES!!
    //return x.connection.dropDatabase()
    //console.log("after dropping collection")
    return Beer.find()
  }) // 3. if it exists, dont seed, otherwise seed
  .then(findPromise => {
    //console.log("findPromise: .", findPromise)
    if (findPromise.length === 0) {
      console.log("empty beer.find!")
    } else {
      console.log("beer find not empty! :)")
      throw new Error("Beer collection already exists! Not seeding.") // we get out of our then chain!
    }
  })
  .then((y) => {
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
