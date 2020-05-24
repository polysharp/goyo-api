const { gql } = require('apollo-server');

const typeDefs = gql`
  type User {
    id: ID!
    email: String!
    firstName: String!
    lastName: String!
    preference: UserPref
  }

  type UserPref {
    language: String
    currency: String
  }

  type AuthResponse {
    token: String!
    expiresIn: Int!
  }

  input SignUpPayload {
    email: String!
    password: String!
    firstName: String!
    lastName: String!
    language: String!
    currency: String!
  }

  input SignInPayload {
    email: String!
    password: String!
  }

  type Query {
    me: User
    refresh: AuthResponse!
  }

  type Mutation {
    signUp(user: SignUpPayload): AuthResponse!
    signIn(user: SignInPayload): AuthResponse!
  }
`;

module.exports = typeDefs;
