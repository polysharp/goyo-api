const User = require('./User');

const resolvers = {
  Query: {
    me: User.queries.me,
    refresh: User.queries.refresh,
  },
  Mutation: {
    signUp: User.mutations.signUp,
    signIn: User.mutations.signIn,
  },
};
module.exports = resolvers;
