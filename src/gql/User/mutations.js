const { AuthenticationError, UserInputError } = require('apollo-server');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const joi = require('@hapi/joi');

const { User, SignUpSchema, SignInSchema } = require('../../models/User');

const signUp = async (_, { user }) => {
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

  const token = jwt.sign(
    {
      id: newUser._id,
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: '1d',
    }
  );

  await newUser.save();

  return `Bearer ${token}`;
};

const signIn = async (_, { user }) => {
  const { error } = SignInSchema.validate(user, { abortEarly: false });
  if (error) {
    throw new UserInputError('SignIn Error', { errors: error.details });
  }

  const dbUser = await User.findOne({ email: user.email });
  if (!dbUser) throw new AuthenticationError('Wrong email or password');

  const pwdMatch = await bcrypt.compare(user.password, dbUser.password);
  if (pwdMatch === false) throw new AuthenticationError('Wrong email or password');

  const token = jwt.sign(
    {
      id: dbUser._id,
    },
    process.env.ACCESS_SECRET,
    {
      expiresIn: '1d',
    }
  );

  return `Bearer ${token}`;
};

module.exports = {
  signUp,
  signIn,
};
