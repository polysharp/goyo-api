require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { typeDefs, User } = require('./gql');
const db = require('./db');

db();

const app = express();

const whitelist = ['http://localhost:3000', 'https://goyo.netlify.app'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
};

app.use(cors(corsOptions));
app.use(cookieParser(process.env.COOKIE_SECRET));

app.use((req, res, next) => {
  // not logged, no cookie => next()
  // logged, cookie + refresh cookie => check refresh token in db, resign jwt, cookie + refresh cookie
  // false logged, cookie expired, refresh cookie ok =>

  const cookies = req.signedCookies;
  const cookiess = req.cookies;
  console.log(cookies, cookiess);
  next();
});

app.use((_, res, next) => {
  const cookieConfig = {
    httpOnly: true,
    secure: true,
    maxAge: 1000000000,
    signed: true,
    sameSite: 'strict',
  };

  res.cookie('x-cookie-token', 'zzz', cookieConfig);
  res.cookie('x-cookie-refresh', 'xxx', cookieConfig);
  next();
});

const resolvers = {
  Query: {
    me: User.queries.me,
  },
  Mutation: {
    signUp: User.mutations.signUp,
    signIn: User.mutations.signIn,
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: process.env.NODE_ENV !== 'production',
  introspection: true,
  context: ({ req }) => {
    try {
      const { authorization } = req.headers;
      if (authorization) {
        const parts = authorization.trim().split(' ');
        if (parts.length === 2 && parts[0] === 'Bearer') {
          const { id } = jwt.verify(parts[1], process.env.ACCESS_SECRET);
          return {
            authorized: true,
            userId: id,
          };
        }
      }
    } catch (error) {
      return { authorized: false };
    }
  },
});

server.applyMiddleware({ app, path: '/', cors: false });

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀  Server ready`);
});
