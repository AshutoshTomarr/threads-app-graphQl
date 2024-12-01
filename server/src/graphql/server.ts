import { ApolloServer } from "@apollo/server";
import { User } from "./user";


async function createApolloGraphqlServer() {
    const gqlServer = new ApolloServer({
        typeDefs: User.typeDefs, // Use centralized typedefs
        resolvers: User.resolvers // Use centralized resolvers
    });
    
    await gqlServer.start();

    return gqlServer;
}

export default createApolloGraphqlServer;