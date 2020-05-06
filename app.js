const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const siteRouter = require("./routes/site-router");
const indexRouter = require("./routes/index");
const usersRouter = require("./routes/users");
const authRouter = require("./routes/auth");
require("dotenv").config()
require("./bin/seeds")

require('dotenv').config();

const mongoose = require("mongoose");

// Session middleware packages

const session = require("express-session");
const MongoStore = require("connect-mongo")(session);

var app = express();

//Mongoose DB Connection


// uros
// MONGOOSE CONNECTION
// mongoose.connect(process.env.MONGODB_URI, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
//

mongoose
  .connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => console.log(`Connected to DB: ${x.connections[0].name}`))
  .catch((err) => console.log(err));

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");

//MIDDLEWARE
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

// SESSION MIDDLEWARE

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: false,
    //cookie: {maxAge: 60000},
    store: new MongoStore({
      mongooseConnection: mongoose.connection,
      ttl: 72 * 60 * 60, // 3 days
    }),
  })
);

//ROUTES

app.use("/", indexRouter);
app.use("/users", usersRouter);
app.use("/auth", authRouter)
app.use("/", siteRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;
