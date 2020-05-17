const { ApolloServer } = require('apollo-server');

const { typeDefs, User } = require('./gql');

const resolvers = {
	Query: {
		users: User.queries.users,
	},
	Mutation: {
		addUser: User.mutations.addUser,
	},
};

const server = new ApolloServer({ typeDefs, resolvers, tracing: true });

server.listen(3000).then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
