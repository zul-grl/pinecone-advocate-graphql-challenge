import Task from "@/graphql/models/Task";
import User from "@/graphql/models/User";
import { createTask } from "@/graphql/resolvers/mutations/createTask";
import { updateTask } from "@/graphql/resolvers/mutations/updateTask";

jest.mock("../../graphql/models/Task");
jest.mock("../../graphql/models/User");

describe("Task Mutations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createTask", () => {
    it("should create a task successfully", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });

      const savedTask = {
        _id: "task123",
        taskName: "New Task",
        description: "Valid description longer than 10 chars",
        priority: 3,
        isDone: false,
        userId: "user123",
      };

      const mockTask = {
        _id: "task123",
        taskName: "New Task",
        description: "Valid description longer than 10 chars",
        priority: 3,
        isDone: false,
        userId: "user123",
        save: jest.fn().mockResolvedValue(savedTask),
      };

      (Task as unknown as jest.Mock).mockImplementation(() => mockTask);

      const result = await createTask(null, {
        taskName: "New Task",
        description: "Valid description longer than 10 chars",
        priority: 3,
        userId: "user123",
      });

      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(result).toEqual(savedTask);
    });

    it("should reject if user doesn't exist", async () => {
      User.findById = jest.fn().mockResolvedValue(null);

      await expect(
        createTask(null, {
          taskName: "New Task",
          description: "Description",
          priority: 2,
          userId: "nonexistent",
        })
      ).rejects.toThrow("User not found");
    });

    it("should handle empty tags array", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });

      const savedTask = {
        _id: "task123",
        taskName: "Task with empty tags",
        description: "Description longer than 10 chars",
        priority: 1,
        isDone: false,
        userId: "user123",
        tags: [],
      };

      const mockTask = {
        _id: "task123",
        taskName: "Task with empty tags",
        description: "Description longer than 10 chars",
        priority: 1,
        isDone: false,
        userId: "user123",
        tags: [],
        save: jest.fn().mockResolvedValue(savedTask),
      };

      (Task as unknown as jest.Mock).mockImplementation(() => mockTask);

      const result = await createTask(null, {
        taskName: "Task with empty tags",
        description: "Description longer than 10 chars",
        priority: 1,
        userId: "user123",
        tags: [],
      });

      expect(result.tags).toEqual([]);
    });

    it("should handle unknown errors", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      (Task as unknown as jest.Mock).mockImplementation(() => {
        throw {};
      });

      await expect(
        createTask(null, {
          taskName: "Task",
          description: "Description longer than 10 chars",
          priority: 1,
          userId: "user123",
        })
      ).rejects.toThrow("Failed to create task");
    });

    it("should reject if description is too short", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      const mockTask = {
        _id: "task123",
        taskName: "Task",
        description: "Short",
        priority: 1,
        userId: "user123",
        save: jest
          .fn()
          .mockRejectedValue(
            new Error("Description must be at least 10 characters long")
          ),
      };
      (Task as unknown as jest.Mock).mockImplementation(() => mockTask);

      await expect(
        createTask(null, {
          taskName: "Task",
          description: "Short",
          priority: 1,
          userId: "user123",
        })
      ).rejects.toThrow("Description must be at least 10 characters long");
    });
  });

  describe("updateTask", () => {
    it("should update a task successfully", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      const mockTask = {
        _id: "task123",
        taskName: "Old Task",
        description: "Old description",
        priority: 2,
        isDone: false,
        userId: "user123",
      };

      Task.findById = jest.fn().mockResolvedValue(mockTask);
      Task.findByIdAndUpdate = jest.fn().mockResolvedValue({
        ...mockTask,
        taskName: "Updated Task",
        description: "New description",
        priority: 3,
      });

      const result = await updateTask(null, {
        taskId: "task123",
        userId: "user123",
        taskName: "Updated Task",
        description: "New description",
        priority: 3,
      });

      expect(Task.findById).toHaveBeenCalledWith("task123");
      expect(result.taskName).toBe("Updated Task");
    });

    it("should reject if user doesn't exist", async () => {
      User.findById = jest.fn().mockResolvedValue(null);

      await expect(
        updateTask(null, {
          taskId: "task123",
          userId: "nonexistent",
          taskName: "Updated Task",
        })
      ).rejects.toThrow("User not found");
    });

    it("should reject if task doesn't exist", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      Task.findById = jest.fn().mockResolvedValue(null);

      await expect(
        updateTask(null, {
          taskId: "nonexistent",
          userId: "user123",
          taskName: "Updated Task",
        })
      ).rejects.toThrow("Task not found");
    });

    it("should reject if user doesn't own the task", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      Task.findById = jest.fn().mockResolvedValue({
        _id: "task123",
        userId: "otherUser",
      });

      await expect(
        updateTask(null, {
          taskId: "task123",
          userId: "user123",
          taskName: "Updated Task",
        })
      ).rejects.toThrow("Unauthorized");
    });

    it("should handle empty update data", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      const mockTask = {
        _id: "task123",
        userId: "user123",
        taskName: "Task Name",
        description: "Different description",
        save: jest.fn(),
      };
      Task.findById = jest.fn().mockResolvedValue(mockTask);
      Task.findByIdAndUpdate = jest.fn().mockResolvedValue(mockTask);

      const result = await updateTask(null, {
        taskId: "task123",
        userId: "user123",
      });

      expect(result).toEqual(mockTask);
    });

    it("should handle unknown errors", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      Task.findById = jest.fn().mockImplementation(() => {
        throw {};
      });

      await expect(
        updateTask(null, {
          taskId: "task123",
          userId: "user123",
        })
      ).rejects.toThrow("Failed to update task");
    });

    it("should reject if description matches task name", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      const mockTask = {
        _id: "task123",
        userId: "user123",
        taskName: "Task",
        description: "Description",
      };
      Task.findById = jest.fn().mockResolvedValue(mockTask);

      await expect(
        updateTask(null, {
          taskId: "task123",
          userId: "user123",
          taskName: "Same",
          description: "Same",
        })
      ).rejects.toThrow("Description cannot be the same as task name");
    });

    it("should reject if only taskName is updated but equals existing description", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      const mockTask = {
        _id: "task123",
        userId: "user123",
        taskName: "Task",
        description: "Description",
      };
      Task.findById = jest.fn().mockResolvedValue(mockTask);

      await expect(
        updateTask(null, {
          taskId: "task123",
          userId: "user123",
          taskName: "Description",
        })
      ).rejects.toThrow("Description cannot be the same as task name");
    });

    it("should reject if only description is updated but equals existing taskName", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      const mockTask = {
        _id: "task123",
        userId: "user123",
        taskName: "Task",
        description: "Description",
      };
      Task.findById = jest.fn().mockResolvedValue(mockTask);

      await expect(
        updateTask(null, {
          taskId: "task123",
          userId: "user123",
          description: "Task",
        })
      ).rejects.toThrow("Description cannot be the same as task name");
    });

    it("should reject if task not found in DB during update", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      const mockTask = {
        _id: "task123",
        userId: "user123",
        taskName: "Task",
        description: "Description",
      };
      Task.findById = jest.fn().mockResolvedValue(mockTask);
      Task.findByIdAndUpdate = jest.fn().mockResolvedValue(null);

      await expect(
        updateTask(null, {
          taskId: "task123",
          userId: "user123",
          description: "New description",
        })
      ).rejects.toThrow("Failed to update task");
    });

    it("should update isDone status", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      const mockTask = {
        _id: "task123",
        userId: "user123",
        taskName: "Task",
        description: "Description",
        isDone: false,
      };
      const updatedTask = {
        ...mockTask,
        isDone: true,
      };
      Task.findById = jest.fn().mockResolvedValue(mockTask);
      Task.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedTask);

      const result = await updateTask(null, {
        taskId: "task123",
        userId: "user123",
        isDone: true,
      });

      expect(result.isDone).toBe(true);
    });

    it("should update tags", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      const mockTask = {
        _id: "task123",
        userId: "user123",
        taskName: "Task",
        description: "Description",
        tags: ["old-tag"],
      };
      const updatedTask = {
        ...mockTask,
        tags: ["new-tag"],
      };
      Task.findById = jest.fn().mockResolvedValue(mockTask);
      Task.findByIdAndUpdate = jest.fn().mockResolvedValue(updatedTask);

      const result = await updateTask(null, {
        taskId: "task123",
        userId: "user123",
        tags: ["new-tag"],
      });

      expect(result.tags).toEqual(["new-tag"]);
    });

    it("should reject if priority is out of range", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      const mockTask = {
        _id: "task123",
        userId: "user123",
        priority: 3,
        taskName: "Task",
        description: "Description",
      };
      Task.findById = jest.fn().mockResolvedValue(mockTask);
      Task.findByIdAndUpdate = jest
        .fn()
        .mockRejectedValue(new Error("Priority must be between 1 and 5"));

      await expect(
        updateTask(null, {
          taskId: "task123",
          userId: "user123",
          priority: 6,
        })
      ).rejects.toThrow("Priority must be between 1 and 5");
    });
  });
});
