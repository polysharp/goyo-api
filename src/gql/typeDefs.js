const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    email: String
    firstName: String
    lastName: String
    preference: UserPref
  }

  type UserPref {
    language: String
    currency: String
  }

  input SignUpPayload {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    language: String!
    currency: String!
  }

  input UpdateUserPayload {
    email: String
    firstName: String
    lastName: String
    language: String
    currency: String
  }

  input SignInPayload {
    email: String!
    password: String!
  }

  type Query {
    me: User
  }

  type Mutation {
    signUp(user: SignUpPayload): Boolean!
    signIn(user: SignInPayload): Boolean!
    updateUser(user: UpdateUserPayload): User!
  }
`;

module.exports = typeDefs;
