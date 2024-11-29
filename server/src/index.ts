import express from 'express';
import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    app.use(express.json());

    // Create GraphQL server
    const gqlServer = new ApolloServer({
        typeDefs: `
            type Query {
                hello: String
                say(name: String) : String
            }
        `, // Schema
        resolvers: {
            Query: {
                hello: () => `Hey there! I am a GraphQL server`,
                say: (_, {name} : {name:string}) => `hey ${name} how are you`
            },
        },
    });

    // Start GraphQL server
    await gqlServer.start(); // Ensure this is awaited

    // Add GraphQL middleware
    app.use('/graphql', expressMiddleware(gqlServer));

    // Test endpoint
    app.get('/', (req, res) => {
        res.json({ message: 'Server running...' });
    });

    // Start Express server
    app.listen(PORT, () => {
        console.log(`Server listening on http://localhost:${PORT}`);
    });
}

init();
