const mongoose = require('mongoose');

module.exports = async () => {
	try {
		await mongoose.connect(
			process.env.MONGO_DB_URI,
			{
				useUnifiedTopology: true,
				useNewUrlParser: true,
				useCreateIndex: true,
				dbName: process.env.MONGO_DB_NAME,
			},
			(error) => {
				if (error) {
					console.error(error);
					return error;
				}
				console.log(`Connected to ${process.env.MONGO_DB_NAME} db.`);
				return null;
			},
		);
	} catch (err) {
		console.log('Failed connection to MONGO DATABASE');
		console.error(err.message);
	}
};
