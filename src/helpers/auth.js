const helpers = {};

// Es un middleware
// En passport existe la función isAuthenticated
helpers.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error_msg', 'Not Authorized');
  res.redirect('/users/signin');
};

module.exports = helpers;
