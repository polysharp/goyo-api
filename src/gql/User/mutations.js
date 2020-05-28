const HTTP_CODES = require('http-status-codes');
const { AuthenticationError, UserInputError, ApolloError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const { ACCESS_SECRET } = require('../../config');
const { JWT_OPTIONS } = require('../../constants');
const { formatUser } = require('./helpers');

const { User, SignUpSchema, SignInSchema, UpdateSchema } = require('../../models/User');

const signUp = async (_, { user }, { res, clientIp }) => {
  const { error } = SignUpSchema.validate(user, { abortEarly: false });
  if (error) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new UserInputError('SignUp Error', { errors: error.details });
  }

  const userExists = await User.find({ email: user.email }, 'id');
  if (userExists.length > 0) {
    res.status(HTTP_CODES.BAD_REQUEST);
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

  const ipHash = await bcrypt.hash(clientIp, 1);
  const accessToken = jwt.sign({ id: newUser._id, ip: ipHash }, ACCESS_SECRET, JWT_OPTIONS);
  res.set('authorization', `Bearer ${accessToken}`);

  return true;
};

const signIn = async (_, { user }, { res, clientIp }) => {
  const { error } = SignInSchema.validate(user, { abortEarly: false });
  if (error) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new UserInputError('SignIn Error', { errors: error.details });
  }

  const dbUser = await User.findOne({ email: user.email });
  if (!dbUser) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new AuthenticationError('Wrong email or password');
  }
  const pwdMatch = await bcrypt.compare(user.password, dbUser.password);
  if (pwdMatch === false) {
    res.status(HTTP_CODES.NOT_FOUND);
    throw new AuthenticationError('Wrong email or password');
  }

  const ipHash = await bcrypt.hash(clientIp, 1);
  const accessToken = jwt.sign({ id: dbUser._id, ip: ipHash }, ACCESS_SECRET, JWT_OPTIONS);
  res.set('authorization', `Bearer ${accessToken}`);

  return true;
};

const update = async (_, { user }, { res, authenticated, userId }) => {
  if (!authenticated) {
    res.status(HTTP_CODES.UNAUTHORIZED);
    throw new AuthenticationError('UNAUTHENTICATED');
  }

  const { error } = UpdateSchema.validate(user, { abortEarly: false });
  if (error) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new ApolloError('User infos not permitted', { errors: error.details });
  }

  if (Object.keys(user).length === 0) {
    res.status(HTTP_CODES.BAD_REQUEST);
    throw new ApolloError('User must have at least 1 element, found 0', HTTP_CODES.BAD_REQUEST);
  }

  try {
    const updatedUser = await User.findByIdAndUpdate({ _id: userId }, user, {
      select: 'email firstName lastName language currency',
    });
    return formatUser(updatedUser);
  } catch (error) {
    res.status(HTTP_CODES.INTERNAL_SERVER_ERROR);
    throw new ApolloError('An unexpected error occured', HTTP_CODES.INTERNAL_SERVER_ERROR);
  }
};

module.exports = {
  signUp,
  signIn,
  update,
};
