const User = require('./User');

const resolvers = {
  Query: {
    me: User.queries.me,
  },
  Mutation: {
    signUp: User.mutations.signUp,
    signIn: User.mutations.signIn,
    updateCurrency: User.mutations.updateCurrency,
    updateLanguage: User.mutations.updateLanguage,
  },
};
module.exports = resolvers;
