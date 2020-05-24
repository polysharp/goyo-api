require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'production';

const MONGO_DB_URI = process.env.MONGO_DB_URI || 'mongodb://localhost:27017';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'goyo';

const ACCESS_SECRET = process.env.ACCESS_SECRET || '<your_access_secret>';
const REFRESH_SECRET = process.env.REFRESH_SECRET || '<your_refresh_secret>';
const COOKIE_SECRET = process.env.COOKIE_SECRET || '<your_cookie_secret>';

module.exports = {
  NODE_ENV,
  MONGO_DB_URI,
  MONGO_DB_NAME,
  ACCESS_SECRET,
  REFRESH_SECRET,
  COOKIE_SECRET,
};
