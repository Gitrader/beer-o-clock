

# BeerO'Clock

## Description

BeerO'Clock is made for beer amateurs who want to share their drinking experience with peers allowing them to review the beers they tried.

## User Stories

- **404** - As a user I want to see a nice 404 page when I go to a page that doesn’t exist so that I know it was my fault

- **500** - As a user I want to see a nice error page when the super team screws it up so that I know that is not my fault

- **homepage** - As a user I want to be able to access the homepage so that I see what the app is about and login and signup

- **sign up** - As a user I want to sign up on the webpage so that I can see all the events that I could attend

- **login** - As a user I want to be able to log in on the webpage so that I can get back to my account

- **logout** - As a user I want to be able to log out from my profile page so that I can make sure no one will access my account

- **beers list** - As a user I want to see all the beers available so that I can discover a variety of them

- **liked beers** - As a user I want to see all the beers that I have liked 

- **add beers** -  As a user I want to add beers that I tried 

- **delete beers** -  As a user I want to delete beers that I have created

- **profile** - As a user I can edit my profile and list all the reviews that I have made, edit and/or delete them

  

## Backlog

List of other features outside of the MVPs scope

User profile:

- see numbers of followers
- upload my profile picture
- filter the user reviews  
- password strength
- list all the reviews 

Beers section:

- filter the beers by different properties
- filter the top ranking 
- share reviews

## ROUTES:

- GET /
  - renders the homepage
- GET /auth/login
  - redirects to main/all if user logged in
- POST /auth/login
  - redirects to main/all if user logged in
- POST /auth/signup
  - body:
    - username
    - password
- GET /auth/login
  - Renders the homepage

- POST /auth/logout
  - body: (empty)
- GET main/all
  - renders the list of beers
- GET main/all/:beerId
  - Renders the beer's page
- Get main/all/:beerId/add-review
  - renders the review form
- POST main/all/:beerId/add-review
  - body:
    - name
    - Country
    - beer type
    - EBU
    - malts
    - hops
    - purchased place
    - purchased country
  - redirect to main/all

- GET main/liked
  - renders the beers liked page
- GET main/top
  - renders the beers ranking page

- GET main/about
  - renders the about page
- GET /profile/:userId
  - Renders the user profile page
- GET profile/:userId/edit/user-info
  - renders the profile form
- POST profile/:userId/edit/user-info
  - body:
    - Profile picture
    - Country
    - City
    - Beer preference
  - Redirects to the profile page
- GET profile/:userId/:beerId/edit-review
  - renders the edit beer form
- POST profile/:userId/:beerId/edit-review
  - body:
    - Review
    - Rate
  - Redirects to the profile page
- GET profile/:beerId/delete-review
  - renders the profile page
- DELETE profile/:beerId/delete-review
  - redirects to profile page



## Models

User model

```js
username: {type : String, required:true, unique: true},
password: {type: String, required:true},
city:{type: String},
country:{type : String, required:true},
beerPreference:{enum:[lager, pilsner, wheat beer, IPA, APA, porter, stout, other]}, 
likedBeers: [{ type: mongoose.ObjectId, ref: "Beer", required: true }],
profilePicture:{type: String },
userReviews: [ { type: mongoose.ObjectId, ref: "Review", required: true }] ,
//followers:[userID]-- backlog
userBeers:[{ type: mongoose.ObjectId, ref: "Beer", required: true }]

//public: {type : boolean, require: true} -- backlog
```

Review Model

```js
beerId:{ type: mongoose.ObjectId, ref: "Beer", required: true },
userId:{ type: mongoose.ObjectId, ref: "User", required: true },
review: {type:String},
rating : {type:Number,enum:[0,1,2,3,5], required:true}
```

Beer

```js
authorId : { type: mongoose.ObjectId, ref: "User", required: true }
name : {type : String,required:true, unique: true},
country :{type : String},
alcoholVol: {type : Number, required:true},
beerType:{type: String, enum:["lager", "pilsner", "wheat beer", "IPA", "APA", "porter", "stout", "other"]},
description:{type : String},
image_url : {type : String},
//public: {type : Boolean, require: true}, 
malt:[String],
hops:[String],
EBU:{type :Number},
//food_pairing: [String] -- backlog
purchasedPlace:{type :String, enum:["local store", "brewery", "supermarket", "bar", "specify"]},
purchasedCountry:{type:String}
```



## Links

### Trello

[Link to your trello board](https://trello.com/b/D9RrPA6j/m2-project) 



### Git

[Repository Link](http://github.com/)

[Deploy Link](http://heroku.com/)



### Slides

[Slides Link](