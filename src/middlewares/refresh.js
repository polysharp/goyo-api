const jwt = require('jsonwebtoken');

const { ACCESS_SECRET } = require('../config');
const { JWT_OPTIONS } = require('../constants');

const refresh = (req, res, next) => {
  const { authenticated, userId: id, iat } = req.user;

  if (authenticated) {
    const now = new Date().getTime() / 1000;
    if (now - iat >= JWT_OPTIONS.expiresIn / 4) {
      const accessToken = jwt.sign({ id, ip }, ACCESS_SECRET, JWT_OPTIONS);
      res.set('authorization', `Bearer ${accessToken}`);
    }
  }

  next();
};

module.exports = refresh;
