const User = require('./User');

const resolvers = {
  Query: {
    me: User.queries.me,
    test: () => 'Hello',
  },
  Mutation: {
    signUp: User.mutations.signUp,
    signIn: User.mutations.signIn,
  },
};
module.exports = resolvers;
