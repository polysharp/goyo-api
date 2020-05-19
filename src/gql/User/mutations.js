const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { AuthenticationError, UserInputError } = require('apollo-server');

const signUp = async (_, { user: { email, password, firstName, lastName, language, currency } }) => {
	const userExists = await User.userExists(email);

	if (userExists === true) {
		throw new UserInputError('Email already taken.');
	}

	const hash = await bcrypt.hash(password, 10);
	const newUser = new User({
		email: email.toLowerCase(),
		password: hash,
		firstName,
		lastName,
		language,
		currency,
	});

	const token = jwt.sign(
		{
			id: newUser._id,
		},
		process.env.ACCESS_SECRET,
		{
			expiresIn: '1d',
		},
	);

	await newUser.save();

	return `Bearer ${token}`;
};

const signIn = async (_, { user: { email, password } }) => {
	const user = await User.findOne({ email });
	if (!user) throw new AuthenticationError('Wrong email or password');

	const pwdMatch = await bcrypt.compare(password, user.password);
	if (pwdMatch === false) throw new AuthenticationError('Wrong email or password');

	const token = jwt.sign(
		{
			id: user._id,
		},
		process.env.ACCESS_SECRET,
		{
			expiresIn: '1d',
		},
	);

	return `Bearer ${token}`;
};

module.exports = {
	signUp,
	signIn,
};
