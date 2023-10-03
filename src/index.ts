import express from "express";
import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";

async function init() {
  const app = express();
  const PORT = Number(process.env.PORT) || 8000;

  app.use(express.json());

  //Create GraphQL Server
  const Server = new ApolloServer({
    //Schema
    typeDefs: `
     type Query {
        hello: String
        say(name: String): String
     }
    `,
    resolvers: {
      Query: {
        hello: () => `Hello, This is response from grapghQL Server!`,
        say: (_, { name }: { name: String }) =>
          `Hello, ${name}, Welcome to grapghQL Server!`,
      },
    },
  });

  //Start GraphQL Server
  await Server.start();

  //Grapgh QL Server accepts only send/parse requests in JSON format
  app.use("/graphql", expressMiddleware(Server));

  app.get("/", (req, res) => {
    res.send("Server is running!");
  });

  app.listen(PORT, () => console.log(`Server is running on ${PORT}`));
}

init();
