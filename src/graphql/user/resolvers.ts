import UserService, { CreateUserPayload } from "../../services/user";

const queries = {
  getUserToken: async (
    _: any,
    payload: { email: string; password: string }
  ) => {
    const token = await UserService.getUserToken({
      email: payload.email,
      password: payload.password,
    });
    return token;
  },
  getCurrentLoggedIn: async (_: any, parameters: any, context: any) => {
    if (context && context.user) {
      const userId = context.user.id;
      const user = await UserService.getUserById(userId);
      return user;
    }
    throw new Error("Invalid User");
  },
};

const mutation = {
  createUser: async (_: any, payload: CreateUserPayload) => {
    const response = await UserService.createUser(payload);
    return response.id;
  },
};

export const resolvers = { queries, mutation };
