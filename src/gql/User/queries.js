const User = require('../../models/User');

const me = async (_, __, { authorized, userId }) => {
	if (!authorized) throw new Error('Access denied.');

	const user = await User.findById(userId, 'id email firstName lastName language currency');
	if (!user) throw new Error('User not found.');

	return {
		id: user._id,
		email: user.email,
		firstName: user.firstName,
		lastName: user.lastName,
		preference: {
			language: user.language,
			currency: user.currency,
		},
	};
};

module.exports = {
	me,
};
