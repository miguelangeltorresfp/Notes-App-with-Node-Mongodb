const passport = require('passport');

const LocalStrategy = require('passport-local').Strategy;

const User = require('../models/User');

passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
    },
    async (email, password, done) => {
      const user = await User.findOne({ email });
      if (!user) {
        return done(null, false, { message: 'Not user found.' });
      }

      const match = await user.matchPassword(password);
      if (match) {
        return done(null, user);
      }
      return done(null, false, { message: 'Incorrect Password' });
    },
  ),
);

// Asocia un id de sesión al usuario
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Busca el usuario asociado con una id de sesión
passport.deserializeUser((id, done) => {
  User.findById(id, (err, user) => {
    done(err, user);
  });
});
