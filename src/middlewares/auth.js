const { ACCESS_SECRET } = require('../config');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const verifyCredentials = (token, clientIp, secret) => {
  try {
    const { id, ip, iat } = jwt.verify(token, secret);
    const ipMatch = bcrypt.compareSync(clientIp, ip);

    if (!ipMatch) return { verified: false };

    return { verified: true, id, ip, iat };
  } catch (error) {
    console.log(error);
    return { verified: false };
  }
};

const auth = (req, _, next) => {
  const user = {
    authenticated: false,
  };

  const bearerToken = req.headers.authorization;

  if (bearerToken) {
    parts = bearerToken.split(' ');

    if (parts.length === 2 && parts[0] === 'Bearer') {
      const [, token] = parts;
      if (token.length > 0) {
        const { verified, id, ip, iat } = verifyCredentials(token, req.clientIp, ACCESS_SECRET);

        if (verified) {
          user.authenticated = true;
          user.userId = id;
          user.iat = iat;
          user.ip = ip;
        }
      }
    }
  }

  req.user = user;
  next();
};

module.exports = auth;
