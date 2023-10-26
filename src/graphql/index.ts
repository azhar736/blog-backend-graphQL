import { ApolloServer } from "@apollo/server";
import { User } from "./user";
async function createApolloGraphqlServer() {
  //Create GraphQL Server
  const Server = new ApolloServer({
    //Schema
    typeDefs: `
     type Query {
       ${User.queries}
     }
     type Mutation {
     ${User.mutation}
     }
    `,
    resolvers: {
      Query: {
        ...User.resolvers.queries,
      },
      Mutation: {
        ...User.resolvers.mutation,
      },
    },
  });

  //Start GraphQL Server
  await Server.start();
  return Server;
}

export default createApolloGraphqlServer;
