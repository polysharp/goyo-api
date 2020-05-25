const { NODE_ENV } = require('./config');

const FRONT_DOMAIN = ['https://goyo.netlify.app'];
const DEVELOPMENT_DOMAIN = ['http://localhost:3000'];

const CORS_OPTIONS = Object.freeze({
  origin: (origin, cb) => {
    if (NODE_ENV === 'production') {
      if (FRONT_DOMAIN.indexOf(origin) !== -1) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'));
      }
    } else {
      if (DEVELOPMENT_DOMAIN.indexOf(origin) !== -1 || !origin) {
        cb(null, true);
      } else {
        cb(new Error('Not allowed by CORS'));
      }
    }
  },
  credentials: true,
});

const ACCESS_COOKIE_NAME = 'x-auth-cookie';
const EXPIRATION_COOKIE_NAME = 'x-expiration-cookie';

const COOKIE_OPTIONS = Object.freeze({
  auth: {
    httpOnly: true,
    secure: NODE_ENV === 'production',
    signed: true,
    maxAge: NODE_ENV === 'production' ? 24 * 60 * 60 * 1000 : 60 * 1000,
    domain: NODE_ENV === 'production' ? 'goyo.netlify.app' : 'localhost',
  },
  fake: {
    httpOnly: false,
    secure: NODE_ENV === 'production',
    signed: false,
    maxAge: NODE_ENV === 'production' ? 24 * 60 * 60 * 1000 : 60 * 1000,
    domain: NODE_ENV === 'production' ? 'goyo.netlify.app' : 'localhost',
  },
});

const JWT_OPTIONS = Object.freeze({
  expiresIn: NODE_ENV === 'production' ? 24 * 60 * 60 : 60,
});

module.exports = {
  CORS_OPTIONS,
  ACCESS_COOKIE_NAME,
  EXPIRATION_COOKIE_NAME,
  COOKIE_OPTIONS,
  JWT_OPTIONS,
};
