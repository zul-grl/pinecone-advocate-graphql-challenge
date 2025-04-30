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

    const existingTask = await Task.findById(taskId);
    if (!existingTask) {
      throw new Error("Task not found");
    }

    if (existingTask.userId.toString() !== userId) {
      throw new Error("Unauthorized");
    }

    const newTaskName = taskName ?? existingTask.taskName;
    const newDescription = description ?? existingTask.description;
    if (newTaskName === newDescription) {
      throw new Error("Description cannot be the same as task name");
    }

    if (priority && (priority < 1 || priority > 5)) {
      throw new Error("Priority must be between 1 and 5");
    }

    const updateData: any = {
      ...(taskName && { taskName }),
      ...(description && { description }),
      ...(priority && { priority }),
      ...(isDone !== undefined && { isDone }),
      ...(tags && { tags }),
      updatedAt: new Date(),
    };

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
