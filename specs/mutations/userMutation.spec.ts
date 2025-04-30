import User from "@/graphql/models/User";
import { createUser } from "@/graphql/resolvers/mutations/createUser";

jest.mock("../../graphql/models/User");

describe("User Mutations", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("createUser", () => {
    it("should create a user successfully", async () => {
      User.findOne = jest.fn().mockResolvedValue(null);

      const savedUser = {
        _id: "user123",
        username: "testuser",
        email: "test@example.com",
        createdAt: new Date(),
      };

      const mockUser = {
        _id: "user123",
        username: "testuser",
        email: "test@example.com",
        save: jest.fn().mockResolvedValue(savedUser),
      };

      (User as unknown as jest.Mock).mockImplementation(() => mockUser);

      const result = await createUser(null, {
        username: "testuser",
        email: "test@example.com",
      });

      expect(User.findOne).toHaveBeenCalledWith({
        $or: [{ username: "testuser" }, { email: "test@example.com" }],
      });
      expect(result).toEqual(savedUser);
    });

    it("should reject if username already exists", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        username: "testuser",
        email: "existing@example.com",
      });

      await expect(
        createUser(null, {
          username: "testuser",
          email: "new@example.com",
        })
      ).rejects.toThrow("Username already exists");
    });

    it("should reject if email already exists", async () => {
      User.findOne = jest.fn().mockResolvedValue({
        username: "existing",
        email: "test@example.com",
      });

      await expect(
        createUser(null, {
          username: "newuser",
          email: "test@example.com",
        })
      ).rejects.toThrow("Email already exists");
    });

    it("should handle unknown errors", async () => {
      User.findOne = jest.fn().mockImplementation(() => {
        throw {};
      });

      await expect(
        createUser(null, {
          username: "testuser",
          email: "test@example.com",
        })
      ).rejects.toThrow("Failed to create user");
    });
  });
});
