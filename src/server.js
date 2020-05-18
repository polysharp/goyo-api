require('dotenv').config();
const { ApolloServer } = require('apollo-server');
const jwt = require('jsonwebtoken');

const { typeDefs, User } = require('./gql');
const db = require('./db');

db();

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
					const { id, email } = jwt.decode(parts[1]);
					return {
						authorized: true,
						user: {
							id,
							email,
						},
					};
				}
			}
		} catch (error) {
			return { authorized: false };
		}
	},
});

server.listen(process.env.PORT || 3000).then(({ url }) => {
	console.log(`🚀  Server ready at ${url}`);
});
