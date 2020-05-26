const express = require('express');
const { ApolloServer } = require('apollo-server-express');

const cors = require('cors');
const requestIp = require('request-ip');

const { CORS_OPTIONS } = require('./constants');
const { NODE_ENV } = require('./config');

const db = require('./db');
const { authMiddleware, refreshMiddleware } = require('./middlewares');
const { typeDefs, resolvers } = require('./gql');

db();

const app = express();

app.use(cors(CORS_OPTIONS));
app.use(requestIp.mw());

app.use(authMiddleware, refreshMiddleware);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  tracing: process.env.NODE_ENV !== 'production',
  introspection: true,
  context: ({ req, res }) => {
    const {
      user: { authenticated, userId },
      clientIp,
    } = req;
    return { authenticated, userId, clientIp, res };
  },
});

server.applyMiddleware({ app, path: '/', cors: false });

app.listen(process.env.PORT || 3000, () => {
  console.log(`🚀 Server ready, running as ${NODE_ENV}`);
});
