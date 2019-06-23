"use strict";

require('dotenv').config();

const PORT        = process.env.PORT || 8080;
const ENV         = process.env.ENV || "development";
const express     = require("express");
const bodyParser  = require("body-parser");
const sass        = require("node-sass-middleware");
const app         = express();

const knexConfig  = require("../knexfile");
const knex        = require("knex")(knexConfig[ENV]);
const morgan      = require('morgan');
const knexLogger  = require('knex-logger');

// ac
const checkPassword = require("./utils/checkPassword");
const cookieSession = require('cookie-session');

app.set('trust proxy', 1) // trust first proxy
 
app.use(cookieSession({
  name: 'session',
  keys: ['moviekey', 'foodkey'],
  
  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}))

// Seperated Routes for each Resource
const usersRoutes = require("./routes/users");

// Load the logger first so all (static) HTTP requests are logged to STDOUT
// 'dev' = Concise output colored by response status for development use.
//         The :status token will be colored red for server error codes, yellow for client error codes, cyan for redirection codes, and uncolored for all other codes.
app.use(morgan('dev'));

// Log knex SQL queries to STDOUT as well
app.use(knexLogger(knex));

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use("../styles", sass({
  src: __dirname + "/styles",
  dest: __dirname + "/public/styles",
  debug: true,
  outputStyle: 'expanded'
}));
app.use(express.static("public"));

// Mount all resource routes
app.use("/api/users", usersRoutes(knex));

// Home page
app.get("/", (req, res) => {
  res.render("index");
});

// Login page
app.get("/login", (req, res) => {
  res.render("login");
});

// Login post - ac
app.post("/login", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send('Please submit a valid username and password');
  } else {
    console.log(req.body);
    let email = req.body.email;
    let inputPassword = req.body.password;
  
    // (email, inputPassword, callback)
    checkPassword.authenticateLogin(email, inputPassword, (userAuth) => {
      console.log('authValue: ', userAuth.authValue);

      if (userAuth.authValue === true) {
        req.session.user_id = userAuth.id;
        //res.render("my-list"); // This not working
        res.send("you're logged in");
      } else {
        res.send('incorrect username and password');
      }

    })
  }

  // Success: req.session.user_id = user.id
  // Redirect

});
    



  

// Register page
app.get("/register", (reg, res) => {
  res.render("register");
})

// Register post
app.post("/register", (req, res) => {
  if (req.body.email === "" || req.body.password === "") {
    res.status(400).send('Please submit a valid username and password');
  }
  console.log(req.body.email, req.body.password);

  // Add verification for database
  //Once user information entered return id from data base
  // and use that as cookie id

  // Send cookie and redirect 
  
})


// Get main page
app.get("/my-list", (req, res) => {
  res.render("my-list");
});

// userInput
app.post("/my-list", (req, res) => {
  let userInput = req.body.userInput
  console.log(userInput);
  ;  
  res.render("my-list");
});

app.listen(PORT, () => {
  console.log("Example app listening on port " + PORT);
});
