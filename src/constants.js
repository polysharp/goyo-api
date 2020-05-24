const { NODE_ENV } = require('./config');

const CORS_WHITELIST = ['http://localhost:3000', 'https://goyo.netlify.app'];

const CORS_OPTIONS = Object.freeze({
  origin: (origin, cb) => {
    if (CORS_WHITELIST.indexOf(origin) !== -1 || !origin) {
      cb(null, true);
    } else {
      cb(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
});

const COOKIE_NAME = 'x-refresh-cookie';
const COOKIE_OPTIONS = Object.freeze({
  httpOnly: true,
  secure: NODE_ENV === 'production',
  signed: true,
  maxAge: NODE_ENV === 'production' ? 86400000 : 1800000,
});

const JWT_NAME = 'x-auth-token';
const JWT_OPTIONS = Object.freeze({
  maxAge: NODE_ENV === 'production' ? 21600000 : 180000,
  audience: '',
});

module.exports = {
  CORS_OPTIONS,
  COOKIE_NAME,
  COOKIE_OPTIONS,
  JWT_NAME,
  JWT_OPTIONS,
};
