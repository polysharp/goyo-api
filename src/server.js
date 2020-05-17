require('dotenv').config();
const { ApolloServer } = require('apollo-server');

const { typeDefs, User } = require('./gql');
const db = require('./db');

db();

const resolvers = {
	Query: {
		users: User.queries.users,
	},
	Mutation: {
		addUser: User.mutations.addUser,
	},
};

const server = new ApolloServer({
	typeDefs,
	resolvers,
	tracing: true,
	context: ({ req }) => {
		console.log(req.headers);
	},
});

server.listen(3000).then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
