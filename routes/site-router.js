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

// to GET liked beers in /liked-beers, we have to find User.find with filter liked beers and then render the page in similar way than all-beers
// probably should be able to click the beers to go to description too..
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

  let promise2 = Review.find({ beerId: req.params.beerId })
    // .populate("")
    .then((review) => {
      console.log("revoew", review);
      return review;
    })
    .catch((err) => console.log(err));

  //could add a 3rd promise to get user to handle liking on the page!

  Promise.all([promise1, promise2])
    .then((resultArray) => {
      res.render("beer-description", {
        beer: resultArray[0],
        review: resultArray[1],
      });
    })
    .catch((err) => console.log(err));
});

// // // /*---> siteRouter.get("/beer-description/:beerId" , isLoggedIn, (req, res, next) => {
// // //   const {beerId}=req.params
// // //     Beer.findById(beerId)
// // //     .then((beer) =>{
// // // res.render("beer-description", {beer:beer});
// // //     })
// // //     .catch (err)=> console.log(err))
// // // });
// // // */

// POST ! only post, no get here
siteRouter.post(
  "/beer-description/:beerId/like",
  isLoggedIn,
  (req, res, next) => {
    console.log("we got inside POST /like");
    const { beerId } = req.params;
    //const userId = req.session.currentUser._id // this ok?
    console.log("beerId: ", beerId);

    // let's promise to find and update our user likes
    User.findByIdAndUpdate(
      { _id: req.session.currentUser._id },
      { $push: { likedBeers: beerId } }
    )
      .then((likeUpdated) => {
        console.log("likeUpdated DID IT WORK", likeUpdated);
        //res.render("beer-description")
        res.redirect(`/beer-description/${req.params.beerId}`);
      })
      .catch((err) => console.log("you cannot like :(", err));
  }
);

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
  const user = req.session.currentUser; // is an object, remember!
  //now make a DB query to find this user and all the beers they like
  User.findById(user._id)
    .populate("likedBeers")
    .then((foundUser) => {
      const likedBeers = foundUser.likedBeers;
      res.render("favorite-beers", { likedBeers: likedBeers });
    })
    .catch((err) => console.log("error in finding fav beers", err));
});

// GET             THIS IS NOT USED
// siteRouter.get("/private", isLoggedIn, (req, res, next) => {
//   res.render("private");
// });

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
      res.render("profile/profile-page", { user: user });
    })
    .catch((err) => {
      console.log("eer", err);
    });
});

// GET
siteRouter.get("/profile/edit-profile", isLoggedIn, (req, res, next) => {
  const user = req.session.currentUser;
  User.findById(user._id)

    .then((user) => {
      const userProfile = user.userProfile;
      res.render("profile/edit-profile", { user: user });
    })
    .catch((err) => {
      console.log("err", err);
    });
});

//////////////////////// EDIT PROFILE /////////////////////////////
//POST
siteRouter.post(
  "/profile/:userId/edit-profile/",
  isLoggedIn,
  parser.single("profilePicture"),
  (req, res) => {
    const user = req.session.currentUser;
    const { name, city, country, beerPreference } = req.body;
    const profile_image_url = req.file.secure_url;
    User.updateOne(
      { _id: userId },
      {
        name,
        profilePicture: profile_image_url,
        city,
        country,
        beerPreference,
      }
    )
      .then(() => {
        res.redirect(`/profile/profile-page`);
      })
      .catch((err) => console.log(err));
  }
);

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
siteRouter.post(
  "/profile/:beerId/edit-beer/",
  isLoggedIn,
  parser.single("image_url"),
  (req, res) => {
    const { beerId } = req.params;
    Beer.findById(beerId)
      .then((beer) => {
        let previousImage = beer.image_url;
        let beer_image_url = req.file ? req.file.secure_url : previousImage;
        return beer_image_url;
      })
      .then((beer_image_url) => {
        const { beerId } = req.params;
        const {
          name,
          // image_url,
          beerType,
          //image_url: beer_image_url,
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
        console.log("req.body", req.body);
        console.log("beerID", beerId);
        const maltsArr=malt.split(",")
        const hopsArr=hops.split(",")
        return Beer.update(
          { _id: beerId },
          {
            authorId: req.session.currentUser._id,
            name,
            image_url: beer_image_url,
            beerType,
            brewery,
            alcoholVol,
            country,
            description,
            malt : maltsArr,
            hops : hopsArr,
            EBU,
            purchasePlace,
            purchaseCountry,
          },
          {
            new: true,
          }
        );
      })
      .then((updatedBeer) => {
        console.log("updated beer", updatedBeer);
        res.redirect(`/profile/profile-page`);
      })
      .catch((err) => console.log(err));
  }
);

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
siteRouter.get(
  "/profile/:reviewId/edit-review/",
  isLoggedIn,
  (req, res, next) => {
    const { reviewId } = req.params;
    console.log("THIS OUR REVIEW ID", reviewId);

    Review.findById(reviewId)
      .then((review) => {
        res.render("profile/edit-review", { review: review });
      })
      .catch((err) => console.log("Find review error", err));
  }
);

// POST
siteRouter.post("/profile/:reviewId/edit-review/", isLoggedIn, (req, res) => {
  const { reviewId } = req.params;
  const { rating, review } = req.body;

  Review.updateOne({ _id: reviewId }, { rating, review })
    .then(() => {
      res.redirect(`/profile/profile-page`);
    })
    .catch((err) => console.log(err));
});

// POST DELETE BEER! will be a form inside edit-beer
siteRouter.post("/profile/:beerId/delete", isLoggedIn, (req, res, next) => {
  console.log("heeeeey from get delete route")
  const { beerId } = req.params;

  Beer.findByIdAndRemove(beerId)
  .then(() => {
    console.log("this is after deleting a beer!")
    res.redirect("/profile/profile-page")
  })
  .catch((err) => console.log("error deleting beer: ",err))
})

module.exports = siteRouter;
