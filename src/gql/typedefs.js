const { gql } = require('apollo-server');

const typeDefs = gql`
	type User {
		id: ID!
		email: String!
	}

	input AuthPayload {
		email: String!
		password: String!
	}

	type AuthResponse {
		user: User!
		token: String!
	}

	type Query {
		me: User
	}

	type Mutation {
		signUp(user: AuthPayload): AuthResponse
		signIn(user: AuthPayload): AuthResponse
	}
`;

module.exports = typeDefs;
