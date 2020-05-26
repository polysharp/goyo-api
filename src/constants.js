const { NODE_ENV, FRONT_DOMAIN_URL } = require('./config');

const FRONT_DOMAIN = [FRONT_DOMAIN_URL];
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
  exposedHeaders: ['authorization'],
});

const JWT_OPTIONS = Object.freeze({
  expiresIn: NODE_ENV === 'production' ? '1d' : '15min',
});

module.exports = {
  CORS_OPTIONS,
  JWT_OPTIONS,
};
