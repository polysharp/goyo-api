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

UserSchema.statics.userExists = async function (email) {
	console.log(email);
	const userExists = await this.model('User').findOne({ email });
	return userExists ? true : false;
};

const User = mongoose.model('User', UserSchema);

module.exports = User;
