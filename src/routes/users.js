const router = require('express').Router();

const passport = require('passport');
const User = require('../models/User');

router.get('/users/signin', (req, res) => {
  res.render('users/signin');
});

router.post(
  '/users/signin',
  passport.authenticate('local', {
    successRedirect: '/notes',
    failureRedirect: '/users/signin',
    failureFlash: true,
  }),
);

router.get('/users/signup', (req, res) => {
  res.render('users/signup');
});

router.post('/users/signup', async (req, res) => {
  const errors = [];
  const { name, email, password, confirmPassword } = req.body;

  if (name.length <= 0) {
    errors.push({ text: 'Name can not be empty' });
  }
  if (email.length <= 0) {
    errors.push({ text: 'email can not be empty' });
  }
  if (password.length <= 0) {
    errors.push({ text: 'password can not be empty' });
  }
  if (confirmPassword.length <= 0) {
    errors.push({ text: 'confirm password can not be empty' });
  }
  if (password !== confirmPassword) {
    errors.push({ text: 'Password do not match' });
  }
  if (password.length < 4) {
    errors.push({ text: 'Password must be at least 4 characters' });
  }
  if (errors.length > 0) {
    res.render('users/signup', {
      errors,
      name,
      email,
      password,
      confirmPassword,
    });
  } else {
    // Look for email coincidence
    const emailUser = await User.findOne({ email });
    if (emailUser) {
      req.flash('error_msg', 'The Email is already in use.');
      res.redirect('/users/signup');
    } else {
      const newUser = new User({ name, email, password });
      newUser.password = await newUser.encryptPassword(password);
      await newUser.save();
      req.flash('success_msg', 'You are registered');
      res.redirect('/users/signin');
    }
  }
});

router.get('/users/logout', (req, res) => {
  req.logOut();
  res.redirect('/');
});

module.exports = router;
