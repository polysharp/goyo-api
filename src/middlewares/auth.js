const { REFRESH_SECRET, ACCESS_SECRET } = require('../config');
const { COOKIE_NAME, JWT_NAME } = require('../constants');
const jwt = require('jsonwebtoken');

const verifyJwt = (token, secret) => {
  try {
    const { id } = jwt.verify(token, secret);
    return { verified: true, id };
  } catch (error) {
    console.log(error);
    return { verified: false, id: null };
  }
};

const auth = (req, _, next) => {
  const user = {
    refreshValid: false,
    accessValid: false,
    userId: undefined,
  };

  const refreshToken = req.signedCookies[COOKIE_NAME];

  if (refreshToken) {
    const { verified: refreshVerified, id } = verifyJwt(refreshToken, REFRESH_SECRET);

    if (refreshVerified) {
      user.refreshValid = refreshVerified;
      user.userId = id;

      const { authorization } = req.headers;

      if (authorization) {
        const parts = authorization.trim().split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          const { verified: accessVerified } = verifyJwt(parts[1], ACCESS_SECRET);
          user.accessValid = accessVerified;
        }
      }
    }
  }

  req.user = user;
  next();
};

module.exports = auth;
