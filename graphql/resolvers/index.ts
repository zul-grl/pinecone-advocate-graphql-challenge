import { createTask } from "./mutations/createTask";
import { createUser } from "./mutations/createUser";
import { sayHello } from "./mutations/say-hello";
import { updateTask } from "./mutations/updateTask";
import { helloQuery } from "./queries/hello-query";
import { getUserDoneTasksLists } from "./queries/taskQueries";

export const resolvers = {
  Query: {
    helloQuery,
    getUserDoneTasksLists,
  },
  Mutation: {
    sayHello,
    addTask: createTask,
    updateTask,
    createUser,
  },
};
