import Task from "@/graphql/models/Task";
import User from "@/graphql/models/User";

export const updateTask = async (
  _: any,
  {
    taskId,
    userId,
    taskName,
    description,
    priority,
    isDone,
    tags,
  }: {
    taskId: string;
    userId: string;
    taskName?: string;
    description?: string;
    priority?: number;
    isDone?: boolean;
    tags?: string[];
  }
) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    const task = await Task.findById(taskId);
    if (!task) {
      throw new Error("Task not found");
    }

    const ownerMatches = task.userId === userId;
    if (!ownerMatches) {
      throw new Error("Unauthorized: You don't own this task");
    }

    const updateData = {
      updatedAt: new Date(),
    } as any;

    if (taskName !== undefined) updateData.taskName = taskName;
    if (description !== undefined) updateData.description = description;
    if (priority !== undefined) updateData.priority = priority;
    if (isDone !== undefined) updateData.isDone = isDone;
    if (tags !== undefined) updateData.tags = tags;

    const finalTaskName = taskName !== undefined ? taskName : task.taskName;
    const finalDescription =
      description !== undefined ? description : task.description;

    if (finalTaskName === finalDescription) {
      throw new Error("Description cannot be the same as task name");
    }

    const updatedTask = await Task.findByIdAndUpdate(taskId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedTask) {
      throw new Error("Failed to update task");
    }

    return updatedTask;
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to update task");
  }
};
