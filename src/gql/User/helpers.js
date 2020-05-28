const formatUser = (user) => ({
  id: user._id,
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  preference: {
    language: user.language,
    currency: user.currency,
  },
});

module.exports = { formatUser };
