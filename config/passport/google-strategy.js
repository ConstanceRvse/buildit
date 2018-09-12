const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;

const User = require("../../models/user-model.js");

passport.use( new GoogleStrategy({
  // settings for the Google strategy
  clientID: process.env.GOOGLE_ID,
  clientSecret: process.env.GOOGLE_SECRET,
  callbackURL: "/google/user-info",
  proxy: true, 
}, (accessToken, refreshToken, userInfo, done) => {
  console.log("Google user info -------------------------------------------------", userInfo);

  const { displayName, emails } = userInfo;

  User.findOne({ email: { $eq: emails[0].value } })
    .then(userDoc => {
      // log them in if we found an account already
      // null in the 1st argument tells passport that there is "null" errors
      if (userDoc){
        done(null, userDoc);
        return;
      }

      // otherwise create a new user account for them
      User.create({ fullName: displayName, email: emails[0].value })
        .then(userDoc => {
          // log in with the new account
          // null in the 1st argument tells passport that there is "null" errors
          done(null, userDoc);
        })
        .catch(err => done(err));
    })
    .catch(err => done(err));
}));