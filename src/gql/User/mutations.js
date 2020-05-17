const { Users } = require('./queries');

const addUser = (_, { user }) => {
	Users.push(user);
	return user;
};

module.exports = {
	addUser,
};
