const { gql } = require('apollo-server');

const typeDefs = gql`
	type User {
		id: ID
		email: String
		password: String
	}

	input NewUser {
		email: String
		password: String
	}

	type Query {
		users: [User]
	}

	type Mutation {
		addUser(user: NewUser): User
	}
`;

module.exports = typeDefs;
