const HTTP_CODES = require('http-status-codes');

const { User } = require('../../models/User');
const { formatUser } = require('./helpers');

const me = async (_, __, { res, authenticated, userId }) => {
  if (!authenticated) return res.status(HTTP_CODES.UNAUTHORIZED);

  const user = await User.findById(userId, 'email firstName lastName language currency');
  if (!user) throw new Error('User not found.');

  return formatUser(user);
};

module.exports = {
  me,
};
