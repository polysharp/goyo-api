const User  = require('../../models/User');

const me = (_, __, { authorized, user }) => {
	if (!authorized) throw new Error('Access denied.');

  const dbUser = await User.findById(user.id);
  if(!dbUser) throw new Error('User not found.');

  return {
    id : dbUser._id,
    email: dbUser.email,
  }
};

module.exports = {
	me,
};
