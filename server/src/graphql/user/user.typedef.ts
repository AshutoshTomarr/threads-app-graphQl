// Defines the GraphQL schema for user-related types, queries, and mutations.
export const typeDefs = `#graphql
    type LoginResponse {
        loggedInUser: LoggedInUser
        accessToken: String
        refreshToken: String
    }

    type LoggedInUser {
        _id: ID
        username: String
        email: String
        fullName: String
    }

    type User{
        username: String!,
        fullName: String!,
        email: String!
    }

    type Query {
        LoginUserAndGetTokens(email: String!, password: String!): LoginResponse
        getCurrentLoggedInUser: LoggedInUser
        getAllusers: [User!]! # fetching all users
    }

    type Mutation {
        createUser(username: String!, email: String!, fullName: String!, password: String!): String
    }
`;