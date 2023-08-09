const dotenv = require('dotenv'); // Add this line

dotenv.config({ path: './config.env' }); 
const passport = require('passport');
const { User } = require('../models/userModel');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy({ usernameField: 'email' }, User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
console.log('CLIENTID:', process.env.CLIENT_ID);

passport.use(
  new GoogleStrategy(
    {
      clientID: "112143794452-lba6liu40kfa977s9fkf540vcbsl8rib.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "https://chersmeatgram.com/api/user/auth/google/meatgram",
      userProfileURL: "https://www.googleapis.com/oauth2/v3/userinfo",
    },
    async (accessToken, refreshToken, profile, cb) => {
      console.log(profile);

      try {
        // Check if the user with the Google ID already exists in the database
        const existingUserByGoogleId = await User.findOne({ googleId: profile.id });

        // Check if the user with the email already exists in the database
        const existingUserByEmail = await User.findOne({ email: profile.emails[0].value });

        if (existingUserByGoogleId) {
          // User with the same Google ID already exists, log in the user
          return cb(null, existingUserByGoogleId);
        } else if (existingUserByEmail) {
          // User with the same email already exists, log in the user
          return cb(null, existingUserByEmail);
        } else {
          // User does not exist, create a new user
          const newUser = await User.create({
            googleId: profile.id,
            username: profile.displayName,
            email: profile.emails[0].value,
            profilePicture: profile.picture,
          });

          // New user created, log in the user
          return cb(null, newUser);
        }
      } catch (err) {
        return cb(err);
      }
    }
  )
);


module.exports = passport; // Add this line to export the configured passport object
