const express = require("express");
const siteRouter = express.Router();
const Beer = require("./../models/beer-model");
const isLoggedIn = require("./../middleware/isLoggedIn");
const parser = require("./../config/cloudinary");
const User = require("./../models/user-model");
const Review = require("./../models/review-model")
require("dotenv").config();

// GET
siteRouter.get("/all-beers", isLoggedIn, (req, res, next) => {
  Beer.find()
    .then((allBeers) => {
      res.render("all-beers", { allBeers: allBeers });
    })
    .catch((err) => console.log(err));
});

// // GET
// siteRouter.get("/beer-description/:beerId" , isLoggedIn, (req, res, next) => {
//   const {beerId} = req.params
//   console.log("req.params",req.params)
//   res.render("beer-description");
// });

siteRouter.get("/beer-description/:beerId", isLoggedIn, (req, res) => {
  const { beerId } = req.params;

  Beer.findById(beerId)

    .then((beer) => {
      console.log("beer", beer);
      res.render("beer-description", { beer: beer });
    })
    .catch((err) => console.log(err));
});

/*---> siteRouter.get("/beer-description/:beerId" , isLoggedIn, (req, res, next) => {
  const {beerId}=req.params
  
    Beer.findById(beerId)
    .then((beer) =>{
res.render("beer-description", {beer:beer});
    })
    .catch (err)=> console.log(err))
  
    
});
*/

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
    // .populate("user")// beer that the user added
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
// siteRouter.get("/profile/profile-page/", isLoggedIn, (req, res, next) => {
//   res.render("profile/profile-page");
// });

// GET
siteRouter.get("/profile/profile-page/", isLoggedIn, (req, res, next) => {
  const { userId } = req.params;
  console.log("req.params", req.params);
  User.findById(userId)

    .then((user) => {
      console.log("user", user);
      res.render("profile/profile-page", { user: user });
    })
    .catch((err) => console.log(err));
});

// GET
siteRouter.get("/profile/edit", isLoggedIn, (req, res, next) => {
  res.render("profile/edit");
});

// GET
siteRouter.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private");
});

// EDIT BEER

// GET    
siteRouter.get("/profile/edit-beer/:beerId", (req, res) => {
  const { beerId } = req.params;

  Beer.findById(beerId)
    .populate("user")
    .then((beer) => {
      res.render("beer-edit", { beer: beer });
    })
    .catch((err) => console.log(err));
});

// GET
siteRouter.get("/profile/edit-beer", isLoggedIn, (req, res, next) => {
  res.render("profile/edit-beer");
});

// POST    
siteRouter.post("/profile/edit-beer/:beerId", (req, res) => {
  const { beerId } = req.params;
  const {
    authorId,
    name,
    image_url,
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

  Beer.updateOne(
    { _id: beerId },
    {
      authorId,
      name,
      image_url,
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
    }
  )
    .then(() => {
      res.redirect("/edit-beer");
    })
    .catch((err) => console.log(err));
});



// GET
siteRouter.get("/profile/edit-reviews", isLoggedIn, (req, res, next) => {
  res.render("profile/edit-reviews");
});

// POST    
siteRouter.post("/profile/edit-reviews/:reviewId", (req, res) => {
  const { reviewId } = req.params;
  const {review,rating} = req.body;

  Review.updateOne({ _id: reviewId },{review,rating})
    .then(() => {
      res.redirect("/edit-reviews");
    })
    .catch((err) => console.log(err));
});



module.exports = siteRouter;
