require('dotenv').config();

const NODE_ENV = process.env.NODE_ENV || 'production';

const MONGO_DB_URI = process.env.MONGO_DB_URI || 'mongodb://localhost:27017';
const MONGO_DB_NAME = process.env.MONGO_DB_NAME || 'goyo';

const ACCESS_SECRET = process.env.ACCESS_SECRET || '<your_access_secret>';

const FRONT_DOMAIN_URL = process.env.FRONT_DOMAIN_URL || 'goyo.polysharp.fr';

module.exports = {
  NODE_ENV,
  MONGO_DB_URI,
  MONGO_DB_NAME,
  ACCESS_SECRET,
  FRONT_DOMAIN_URL,
};
