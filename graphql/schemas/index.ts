import gql from "graphql-tag";

export const typeDefs = gql`
  type Task {
    _id: ID!
    taskName: String!
    description: String!
    isDone: Boolean!
    priority: Int!
    tags: [String!]
    createdAt: String!
    updatedAt: String!
    userId: String!
  }

  type User {
    _id: ID!
    username: String!
    email: String!
  }

  type Query {
    getUserDoneTasksLists(userId: String!): [Task!]!
  }

  type Mutation {
    addTask(
      taskName: String!
      description: String!
      priority: Int!
      tags: [String!]
      userId: String!
    ): Task!
    updateTask(
      taskId: ID!
      userId: String!
      taskName: String
      description: String
      priority: Int
      isDone: Boolean
      tags: [String!]
    ): Task!
    createUser(username: String!, email: String!): User!
  }
`;
