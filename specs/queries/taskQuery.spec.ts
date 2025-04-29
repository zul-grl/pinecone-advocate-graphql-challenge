import Task from "@/graphql/models/Task";
import User from "@/graphql/models/User";
import { taskQueries } from "@/graphql/resolvers/queries/taskQueries";

jest.mock("../../graphql/models/Task");
jest.mock("../../graphql/models/User");

describe("Task Queries", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getUserDoneTasksLists", () => {
    it("should return done tasks for user", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      const mockTasks = [
        {
          _id: "task1",
          taskName: "Done Task 1",
          isDone: true,
          userId: "user123",
          description: "Description 1",
          priority: 2,
        },
        {
          _id: "task2",
          taskName: "Done Task 2",
          isDone: true,
          userId: "user123",
          description: "Description 2",
          priority: 3,
        },
      ];

      Task.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTasks),
      });

      const result = await taskQueries.getUserDoneTasksLists(null, {
        userId: "user123",
      });

      expect(User.findById).toHaveBeenCalledWith("user123");
      expect(Task.find).toHaveBeenCalledWith({
        userId: "user123",
        isDone: true,
      });
      expect(result).toEqual(mockTasks);
      expect(result.length).toBe(2);
    });

    it("should throw if user doesn't exist", async () => {
      User.findById = jest.fn().mockResolvedValue(null);

      await expect(
        taskQueries.getUserDoneTasksLists(null, { userId: "nonexistent" })
      ).rejects.toThrow("User not found");
    });

    it("should handle no tasks found", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      Task.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      });

      await expect(
        taskQueries.getUserDoneTasksLists(null, { userId: "user123" })
      ).rejects.toThrow("No tasks found");
    });

    it("should handle unknown errors", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      Task.find = jest.fn().mockImplementation(() => {
        throw {};
      });

      await expect(
        taskQueries.getUserDoneTasksLists(null, { userId: "user123" })
      ).rejects.toThrow("Failed to fetch tasks");
    });

    it("should return empty array if no done tasks", async () => {
      User.findById = jest.fn().mockResolvedValue({ _id: "user123" });
      Task.find = jest.fn().mockReturnValue({
        exec: jest.fn().mockResolvedValue([]),
      });

      const result = await taskQueries.getUserDoneTasksLists(null, {
        userId: "user123",
      });

      expect(result).toEqual([]);
    });
  });
});
