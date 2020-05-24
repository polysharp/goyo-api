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

const COOKIE_NAME = 'x-refresh-cookie';
const COOKIE_OPTIONS = Object.freeze({
  httpOnly: true,
  secure: NODE_ENV === 'production',
  signed: true,
  maxAge: NODE_ENV === 'production' ? 7 * 24 * 60 * 60 * 1000 : 60 * 1000,
});

const JWT_OPTIONS = Object.freeze({
  forAccessToken: {
    expiresIn: NODE_ENV === 'production' ? 24 * 60 * 60 : 30,
  },
  forRefreshToken: {
    expiresIn: NODE_ENV === 'production' ? 7 * 24 * 60 * 60 : 60,
  },
});

module.exports = {
  CORS_OPTIONS,
  COOKIE_NAME,
  COOKIE_OPTIONS,
  JWT_OPTIONS,
};
