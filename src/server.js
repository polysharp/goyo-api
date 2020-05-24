require('dotenv').config();
const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const { typeDefs, User } = require('./gql');
const db = require('./db');

const cookieConfig = {
  httpOnly: true,
  secure: true,
  signed: true,
};

db();

const app = express();

const whitelist = ['http://localhost:3000', 'https://goyo.netlify.app'];
const corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
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
  try {
    const tokenCookie = req.signedCookies['x-cookie-token'];
    const refreshCookie = req.signedCookies['x-cookie-refresh-token'];

    if (refreshCookie && tokenCookie) {
      const { id: tokenId } = jwt.verify(tokenCookie, process.env.ACCESS_SECRET);
      const { id: refreshId } = jwt.verify(refreshCookie, process.env.REFRESH_SECRET);

      const token = jwt.sign(
        {
          id: tokenId,
        },
        process.env.ACCESS_SECRET,
        {
          expiresIn: '1d',
        }
      );
      const refresh = jwt.sign(
        {
          id: refreshId,
        },
        process.env.REFRESH_SECRET,
        {
          expiresIn: '7d',
        }
      );

      res.cookie('x-cookie-token', token, { ...cookieConfig, maxAge: 86400000 });
      res.cookie('x-cookie-refresh-token', refresh, { ...cookieConfig, maxAge: 604800000 });

      req.authorized = true;
    }

    if (refreshCookie === undefined) {
      req.authorized = false;
    }

    if (tokenCookie === undefined && refreshCookie) {
      req.authorized = true;
    }

    if (refreshCookie === false || tokenCookie === false) {
      req.authorized = false;
    }
    next();
  } catch (error) {
    req.authorized = false;
    next();
  }
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
