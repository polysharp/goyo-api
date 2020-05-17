const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = mongoose.Schema({
	email: {
		type: String,
		trim: true,
		unique: true,
		required: true,
		validate: {
			validator: validator.isEmail,
			message: '{VALUE} is not a valid email',
		},
	},
	password: {
		type: String,
		trim: true,
		required: true,
	},
});

const User = mongoose.model('User', UserSchema);

module.exports = User;
