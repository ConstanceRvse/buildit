// GENERAL PASSPORT SETUP
const passport = require("passport");

const User = require("../../models/user-model.js");

require("./google-strategy.js");

// serializeUser() defines what user data to save in the session
// happens when you log in successfully
passport.serializeUser((userDoc, done) => {
  console.log("SERIALIZE (save user ID to sessions)");
  
  // "null" in the 1st argument tells Passport that there is "null" errors
  done(null, userDoc._id);
});

// deserializeUser() defines how to retrieve the user information from the DB
// happens automatically on every request after you log in
passport.deserializeUser((userId, done) => {
  console.log("DESERIALIZE (retrieve user info from the DB)");

  User.findById(userId)
    .then(userDoc => {
      done(null, userDoc);
    })
    .catch(err => done(err));
});

function passportSetup(app) {
  // PASSPORT SETUP INVOLVING "app"
  
  // add Passport propreties and methods to the "request" object in our ROUTES
  app.use(passport.initialize());
  app.use(passport.session());

  // MISSING THING HERE
  app.use((req, res, next) => {
    // make req.user accessible inside hbs files as currentUser
    res.locals.currentUser = req.user;

    // next() means continue on the next middleware (our routes)
    next();
  });
}

module.exports = passportSetup;