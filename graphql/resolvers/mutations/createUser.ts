import User from "@/graphql/models/User";

export const createUser = async (
  _: any,
  {
    username,
    email,
  }: {
    username: string;
    email: string;
  }
) => {
  try {
    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      if (existingUser.username === username) {
        throw new Error("Username already exists");
      }
      if (existingUser.email === email) {
        throw new Error("Email already exists");
      }
    }

    const newUser = new User({
      username,
      email,
    });

    return await newUser.save();
  } catch (error: unknown) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("Failed to create user");
  }
};
