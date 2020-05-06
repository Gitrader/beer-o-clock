const express = require("express");
const siteRouter = express.Router();
const Beer = require("./../models/beer-model");
const isLoggedIn = require("./../middleware/isLoggedIn");
const parser = require("./../config/cloudinary");
const User = require("./../models/user-model");
const Review = require("./../models/review-model");
require("dotenv").config();

// function linkBeerWithUser (user){
//   .populate ("User")
//   .then((data) => {
//     res.redirect("all-beers");
//   })
//   .catch((err) => console.log(err));
// }

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

  let promise1 = Beer.findById(beerId)

    .then((beer) => {
      console.log("beer", beer);
      return beer;
    })
    .catch((err) => console.log(err));

  let promise2 = Review.findOne({ beerId: req.params.beerId })
    // .populate("")
    .then((review) => {
      console.log("revoew", review);
      return review;
    })
    .catch((err) => console.log(err));

  Promise.all([promise1, promise2])
    .then((resultArray) => {
      res.render("beer-description", {
        beer: resultArray[0],
        review: resultArray[1],
      });
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
      authorId: req.session.currentUser._id,
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
      //.populate("authorId")// beer that the user added
      .then((beerCreated) => {
        return User.updateOne(
          { _id: beerCreated.authorId },
          { $push: { userBeers: beerCreated._id } }
        ); //userBeers
        // adding to the array of the user beer beerCreated._id $push
      })
      .then((userUpdated) => {
        console.log("userUpdated", userUpdated);
        res.redirect("all-beers");
      })
      .catch((err) => console.log(err));
  }
);

// GET
siteRouter.get(
  "/beer-description/:beerId/add-review",
  isLoggedIn,
  (req, res, next) => {
    res.render("add-review", { beerId: req.params.beerId });
  }
);

//POST
siteRouter.post(
  "/beer-description/:beerId/add-review",
  isLoggedIn,
  (req, res, next) => {
    const { review, rating } = req.body;

    const newReview = {
      beerId: req.params.beerId,
      userId: req.session.currentUser._id,
      review,
      rating,
    };

    Review.create(newReview)
      // .populate("userId")// beer that the user added
      .then((reviewCreated) => {
        console.log("rev created", reviewCreated);
        return User.updateOne(
          { _id: reviewCreated.userId },
          { $push: { userReviews: reviewCreated._id } }
        ); //userBeers
        // adding to the array of the user beer beerCreated._id $push
      })
      .then((userUpdated) => {
        console.log("userUpdated", userUpdated);
        res.redirect(`/beer-description/${req.params.beerId}`);
      })
      .catch((err) => console.log(err));
  }
);

// GET
siteRouter.get("/favorite-beers", isLoggedIn, (req, res, next) => {
  res.render("favorite-beers");
});

// GET
siteRouter.get("/private", isLoggedIn, (req, res, next) => {
  res.render("private");
});


// GET
// siteRouter.get("/profile/profile-page/", isLoggedIn, (req, res, next) => {
//   res.render("profile/profile-page");
// });

// IF WE NEED TO IMPLEMENT PUBLIC OR PRIVATE VIEW

// siteRouter.get("/profile/profile-page/:userId", isLoggedIn, (req, res, next) => {
//   const {userId} = req.params;
//   console.log("req.params", req.params);
//   User.findById(userId)

//     .then((user) => {
//       console.log("user", user);
//       res.render("profile/profile-page", { user: user });
//     })
//     .catch((err) => console.log(err));
// });

// POST PROFILE EDIT ROUTE

// AFTER EDITING THE USER IN DB, SAVE THE UPDATED USER IN req.session.currentUser


/////////////// PROFILE ////////////



// GET
siteRouter.get("/profile/profile-page/", isLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  User.findById(user._id)
    .populate("userBeers")
    .populate("userReviews")
    // likedBeers can be added here too
    .then((user) => {
      const userReviews = user.userReviews;
      res.render("profile/profile-page", { user: user});
    })
    .catch((err) => {
      console.log("eer", err);
    });
});

// GET
siteRouter.get("/profile/edit-profile", isLoggedIn, (req, res, next) => {
  res.render("profile/edit-profile");
});

//////////////////////// EDIT PROFILE /////////////////////////////
//POST
siteRouter.post("/profile/:userId/edit-profile/", isLoggedIn, parser.single("profilePicture"),(req, res) => {
  const user = req.session.currentUser;
  const {
    name,
    city,
    country,
    beerPreference,
    } = req.body;
    const profile_image_url = req.file.secure_url;
  User.updateOne(
    { _id: userId },
    {
      name,
      profilePicture : profile_image_url,
      city,
      country,
      beerPreference,
    }
  )
    .then(() => {
      res.redirect(`/profile/profile-page`); 
    })
    .catch((err) => console.log(err));
});



/////////////////////// EDIT BEER ///////////////////////////////

// GET DON'T NEED IT
// siteRouter.get("/profile/edit-beer", isLoggedIn, (req, res, next) => {
//   res.render("profile/edit-beer");
// });

// GET
siteRouter.get("/profile/:beerId/edit-beer/", isLoggedIn, (req, res) => {
  const { beerId } = req.params;

  Beer.findById(beerId)
    // .populate("User")
    .then((beer) => {
      res.render("profile/edit-beer", { beer: beer });
    })
    .catch((err) => console.log(err));
});

            // GET
            // siteRouter.get("/profile/edit-beer", isLoggedIn, (req, res, next) => {
            //   res.render("profile/edit-beer");
            // });

// POST
siteRouter.post("/profile/:beerId/edit-beer/", isLoggedIn, (req, res) => {
  const { beerId } = req.params;
  const {
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
  const beer_image_url = req.file.secure_url;
  Beer.updateOne(
    { _id: beerId },
    {
      authorId: req.session.currentUser._id,
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
      res.redirect(`/profile/profile-page`); 
    })
    .catch((err) => console.log(err));
});



// POST
// siteRouter.post("/profile/edit-reviews/:reviewId", isLoggedIn, (req, res) => {
//   const { reviewId } = req.params;
//   const { review, rating } = req.body;

//   Review.updateOne({ _id: reviewId }, { review, rating })
//     .then(() => {
//       res.redirect("/edit-reviews");
//     })
//     .catch((err) => console.log(err));
// });

// GET
// siteRouter.get("/profile/:beerId/edit-beer/", isLoggedIn, (req, res) => {
//   const { beerId } = req.params;

//   Beer.findById(beerId)
//     // .populate("User")
//     .then((beer) => {
//       res.render("profile/edit-beer", { beer: beer });
//     })
//     .catch((err) => console.log(err));
// });



//////REVIEW EXAMPLE//////
// GET
siteRouter.get("/profile/:reviewId/edit-review/", isLoggedIn, (req, res, next) => {
  const { reviewId } = req.params
  console.log("THIS OUR REVIEW ID", reviewId)
 

  Review.findById(reviewId)
  .then(review=>{
    res.render("profile/edit-review", {review:review});
  })
  .catch((err) => console.log("Find review error",err));
});



// POST
siteRouter.post("/profile/:reviewId/edit-review/", isLoggedIn, (req, res) => {
  const { reviewId } = req.params;
  const { rating, review } = req.body;

  Review.updateOne({ _id: reviewId },{rating,review})
    .then(() => {
      res.redirect(`/profile/profile-page`); 
    })
    .catch((err) => console.log(err));
});

module.exports = siteRouter;
