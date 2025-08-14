const jwt = require('jsonwebtoken');
const JWT_SECRET = "key";

function checkLoggedIn(req, res, next) {
  const token = req.cookies.token;
  if (!token) return next(); 

  try {
    jwt.verify(token, JWT_SECRET);
    return res.redirect('/');
  } catch (err) {
    res.clearCookie("token"); 
    return next();
  }
}

module.exports = checkLoggedIn;
