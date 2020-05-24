const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const cors = require('cors');
const cookieParser = require('cookie-parser');

const { CORS_OPTIONS } = require('./constants');
const { COOKIE_SECRET } = require('./config');

const db = require('./db');
const { authMiddleware } = require('./middlewares');
const { typeDefs, User } = require('./gql');

db();

const app = express();

app.use(cors(CORS_OPTIONS));
app.use(cookieParser(COOKIE_SECRET));

app.use(authMiddleware);

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
    // try {
    //   const { authorization } = req.headers;
    //   if (authorization) {
    //     const parts = authorization.trim().split(' ');
    //     if (parts.length === 2 && parts[0] === 'Bearer') {
    //       const { id } = jwt.verify(parts[1], process.env.ACCESS_SECRET);
    //       return {
    //         authorized: true,
    //         userId: id,
    //       };
    //     }
    //   }
    // } catch (error) {
    //   return { authorized: false };
    // }
  },
});

server.applyMiddleware({ app, path: '/', cors: false });

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀  Server ready`);
});
