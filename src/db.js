const mongoose = require('mongoose');

const { MONGO_DB_URI, MONGO_DB_NAME } = require('./config');

module.exports = async () => {
  try {
    await mongoose.connect(
      MONGO_DB_URI,
      {
        useUnifiedTopology: true,
        useNewUrlParser: true,
        useCreateIndex: true,
        dbName: MONGO_DB_NAME,
      },
      (error) => {
        if (error) {
          console.error(error);
          return error;
        }
        console.log(`Connected to ${MONGO_DB_NAME} db.`);
        return null;
      }
    );
  } catch (err) {
    console.log(`Failed connection to ${MONGO_DB_NAME}`);
    console.error(err.message);
  }
};
