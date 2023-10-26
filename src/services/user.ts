import { prismaClient } from "../lib/db";
import { createHmac, randomBytes } from "node:crypto";
import { sign, decode, verify } from "jsonwebtoken";
const JWT_SECRET = "esfghj34567ggdeuyh";
export interface CreateUserPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface GetUserTokenPayload {
  email: string;
  password: string;
}
class UserService {
  private static generateHash(salt: string, password: string) {
    const hashPassword = createHmac("sha256", salt)
      .update(password)
      .digest("hex");
    return hashPassword;
  }

  public static getUserById(id: number) {
    return prismaClient.user.findUnique({ where: { id } });
  }

  public static createUser(payload: CreateUserPayload) {
    const { firstName, lastName, email, password } = payload;
    /*We can do the API level validation for the Input here */
    const salt = randomBytes(32).toString("hex");
    const hashedPassword = UserService.generateHash(salt, password);
    return prismaClient.user.create({
      data: {
        firstName,
        lastName,
        email,
        salt,
        password: hashedPassword,
      },
    });
  }

  private static getUserByEmail(email: string) {
    return prismaClient.user.findUnique({ where: { email } });
  }
  public static async getUserToken(payload: GetUserTokenPayload) {
    const { email, password } = payload;
    const user = await UserService.getUserByEmail(email);
    if (!user) throw new Error("user not found!");
    const userSalt = user.salt;
    const hashedPassword = UserService.generateHash(userSalt, password);
    if (hashedPassword !== user.password) {
      throw new Error("Invalid password!");
    }

    //Generate Token
    const token = sign({ id: user.id, email: user.email }, JWT_SECRET);
    return token;
  }

  public static decodedToken(token: string) {
    return verify(token, JWT_SECRET);
  }
}

export default UserService;
