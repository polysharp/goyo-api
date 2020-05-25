const jwt = require('jsonwebtoken');

const { ACCESS_SECRET } = require('../config');
const {
  ACCESS_COOKIE_NAME,
  EXPIRATION_COOKIE_NAME,
  COOKIE_OPTIONS,
  JWT_OPTIONS,
} = require('../constants');

const refresh = (req, res, next) => {
  const { authenticated, userId: id, iat } = req.user;

  if (authenticated) {
    const now = new Date().getTime() / 1000;
    if (now - iat >= JWT_OPTIONS.expiresIn / 4) {
      const accessToken = jwt.sign({ id }, ACCESS_SECRET, JWT_OPTIONS);
      res.cookie(ACCESS_COOKIE_NAME, accessToken, COOKIE_OPTIONS.auth);
      res.cookie(EXPIRATION_COOKIE_NAME, COOKIE_OPTIONS.auth.maxAge, COOKIE_OPTIONS.fake);
    }
  }

  next();
};

module.exports = refresh;
