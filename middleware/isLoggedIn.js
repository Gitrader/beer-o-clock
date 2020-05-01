// Middleware function - checks if the user is authenticated

function isLoggedIn(req, res, next) {
    if (req.session.currentUser) {
      // If user is authenticated
      next();
    } else {
      res.redirect("/auth/login");
    }
  }
  
  module.exports = isLoggedIn;