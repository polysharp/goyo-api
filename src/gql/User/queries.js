const me = (_, __, { authorized, user }) => {
	if (!authorized) throw new Error('Access denied.');
	return user;
};

module.exports = {
	me,
};
