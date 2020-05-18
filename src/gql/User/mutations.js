const User = require('../../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { AuthenticationError } = require('apollo-server');

const signUp = async (_, { user: { email, password } }) => {
	const userExists = await User.userExists(email);

	if (userExists === true) {
		throw new Error('Email already taken.');
	}

	const hash = await bcrypt.hash(password, 10);
	const newUser = new User({
		email: email,
		password: hash,
	});

	const token = jwt.sign(
		{
			id: newUser._id,
			email,
		},
		process.env.ACCESS_SECRET,
		{
			expiresIn: '1d',
		},
	);

	await newUser.save();

	return {
		user: {
			id: newUser._id,
			email: newUser.email,
		},
		token: `Bearer ${token}`,
	};
};

const signIn = async (_, { user: { email, password } }) => {
	const user = await User.findOne({ email });
	if (!user) throw new AuthenticationError('Wrong email or password');

	const pwdMatch = await bcrypt.compare(password, user.password);
	if (pwdMatch === false) throw new AuthenticationError('Wrong email or password');

	const token = jwt.sign(
		{
			id: user._id,
			username: user.email,
		},
		process.env.ACCESS_SECRET,
		{
			expiresIn: '1d',
		},
	);

	return {
		user: {
			id: user._id,
			email: user.email,
		},
		token: `Bearer ${token}`,
	};
};

module.exports = {
	signUp,
	signIn,
};
