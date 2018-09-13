const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const User = require('../models/user');
const psw = require('../libs/password');

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User
    .findById(id, function (err, user) {
      done(err, user);
    });
});

passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'
  },
  function (username, password, done) {
    //this one is typically a DB call. Assume that the returned user object is pre-formatted and ready for storing in JWT
    return User.findOne({username: username})
      .then(user => {
        if (!user) {
          return done(null, false);
        }
        if (!psw.validPassword(password, user.password)) {
          return done(null, false);
        }
        return done(null, user);
      })
      .catch(err => done(err));
  }
));