import { createTask } from "./mutations/createTask";
import { sayHello } from "./mutations/say-hello";
import { updateTask } from "./mutations/updateTask";
import { helloQuery } from "./queries/hello-query";
import { taskQueries } from "./queries/taskQueries";

export const resolvers = {
  Query: {
    helloQuery,
    taskQueries,
  },
  Mutation: {
    sayHello,
    createTask,
    updateTask,
  },
};
