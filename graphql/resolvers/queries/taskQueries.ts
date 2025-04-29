import Task from "@/graphql/models/Task";
import User from "@/graphql/models/User";

export const taskQueries = {
  getUserDoneTasksLists: async (_: any, { userId }: { userId: string }) => {
    try {
      const user = await User.findById(userId);
      if (!user) {
        throw new Error("User not found");
      }
      const tasks = await Task.find({
        userId,
        isDone: true,
      }).exec();

      if (!tasks) {
        throw new Error("No tasks found");
      }

      return tasks;
    } catch (error: unknown) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error("Failed to fetch tasks");
    }
  },
};
