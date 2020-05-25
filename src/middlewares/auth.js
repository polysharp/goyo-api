const { ACCESS_SECRET } = require('../config');
const { ACCESS_COOKIE_NAME } = require('../constants');
const jwt = require('jsonwebtoken');

const verifyJwt = (token, secret) => {
  try {
    const { id, iat } = jwt.verify(token, secret);
    return { verified: true, id, iat };
  } catch (error) {
    console.log(error);
    return { verified: false };
  }
};

const auth = (req, _, next) => {
  const user = {
    authenticated: false,
  };

  const accessCookie = req.signedCookies[ACCESS_COOKIE_NAME];

  if (accessCookie) {
    const { verified, id, iat } = verifyJwt(accessCookie, ACCESS_SECRET);

    if (verified) {
      user.authenticated = true;
      user.userId = id;
      user.iat = iat;
    }
  }

  req.user = user;
  next();
};

module.exports = auth;
