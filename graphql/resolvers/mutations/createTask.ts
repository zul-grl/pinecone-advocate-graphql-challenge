import Task from "@/graphql/models/Task";
import User from "@/graphql/models/User";

export const createTask = async (
  _: any,
  {
    taskName,
    description,
    priority,
    tags,
    userId,
  }: {
    taskName: string;
    description: string;
    priority: number;
    tags?: string[];
    userId: string;
  }
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const newTask = new Task({
      taskName,
      description,
      priority,
      tags: tags || [],
      userId,
    });

    return await newTask.save();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create task");
  }
};
