import express from "express";
import { expressMiddleware } from "@apollo/server/express4";
import createApolloGraphqlServer from "./graphql";
import UserService from "./services/user";
async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  app.get("/", (req, res) => {
    res.send("Server is running!");
  });

  type MyGraphQLContext = {
    user?: any;
  };

  app.use(
    "/graphql",
    expressMiddleware(await createApolloGraphqlServer(), {
      context: async ({ req }): Promise<MyGraphQLContext> => {
        // @ts-ignore
        const token = req.headers["token"];
        try {
          const user = UserService.decodedToken(token as string);
          return { user };
        } catch (error) {
          return {};
        }
      },
    })
  );

  app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
}

init();
