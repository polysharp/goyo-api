const jwt = require('jsonwebtoken');

const { User } = require('../../models/User');
const { ACCESS_SECRET, REFRESH_SECRET } = require('../../config');
const { COOKIE_NAME, COOKIE_OPTIONS, JWT_OPTIONS } = require('../../constants');

const me = async (_, __, { accessValid, userId }) => {
  if (!accessValid) throw new Error('Access denied.');

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

const refresh = async (_, __, { refreshValid, userId, res }) => {
  if (!refreshValid) throw new Error('Access denied.');

  const accessToken = jwt.sign(
    {
      id: userId,
    },
    ACCESS_SECRET,
    JWT_OPTIONS.forAccessToken
  );

  const refreshToken = jwt.sign(
    {
      id: userId,
    },
    REFRESH_SECRET,
    JWT_OPTIONS.forRefreshToken
  );

  res.cookie(COOKIE_NAME, refreshToken, COOKIE_OPTIONS);
  return {
    token: `Bearer ${accessToken}`,
    expiresIn: JWT_OPTIONS.forAccessToken.expiresIn * 1000,
  };
};

module.exports = {
  me,
  refresh,
};
