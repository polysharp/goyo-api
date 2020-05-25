const { AuthenticationError, UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { ACCESS_SECRET, REFRESH_SECRET } = require('../../config');
const {
  ACCESS_COOKIE_NAME,
  EXPIRATION_COOKIE_NAME,
  COOKIE_OPTIONS,
  JWT_OPTIONS,
} = require('../../constants');

const { User, SignUpSchema, SignInSchema } = require('../../models/User');

const signUp = async (_, { user }, { res }) => {
  const { error } = SignUpSchema.validate(user, { abortEarly: false });
  if (error) {
    throw new UserInputError('SignUp Error', { errors: error.details });
  }

  const userExists = await User.find({ email: user.email }, 'id');
  if (userExists.length > 0) {
    throw new UserInputError('Email already taken.', {
      email: {
        used: true,
      },
    });
  }

  const hash = await bcrypt.hash(user.password, 10);
  const newUser = new User({
    email: user.email.toLowerCase(),
    password: hash,
    firstName: user.firstName,
    lastName: user.lastName,
    language: user.language,
    currency: user.currency,
  });

  await newUser.save();

  const accessToken = jwt.sign(
    {
      id: newUser._id,
    },
    ACCESS_SECRET,
    JWT_OPTIONS
  );

  res.cookie(ACCESS_COOKIE_NAME, accessToken, COOKIE_OPTIONS.auth);
  res.cookie(EXPIRATION_COOKIE_NAME, COOKIE_OPTIONS.auth.maxAge, COOKIE_OPTIONS.fake);

  return true;
};

const signIn = async (_, { user }, { res }) => {
  const { error } = SignInSchema.validate(user, { abortEarly: false });
  if (error) {
    throw new UserInputError('SignIn Error', { errors: error.details });
  }

  const dbUser = await User.findOne({ email: user.email });
  if (!dbUser) throw new AuthenticationError('Wrong email or password');

  const pwdMatch = await bcrypt.compare(user.password, dbUser.password);
  if (pwdMatch === false) throw new AuthenticationError('Wrong email or password');

  const accessToken = jwt.sign(
    {
      id: dbUser._id,
    },
    ACCESS_SECRET,
    JWT_OPTIONS
  );

  res.cookie(ACCESS_COOKIE_NAME, accessToken, COOKIE_OPTIONS.auth);
  res.cookie(EXPIRATION_COOKIE_NAME, COOKIE_OPTIONS.auth.maxAge, COOKIE_OPTIONS.fake);

  return true;
};

module.exports = {
  signUp,
  signIn,
};
