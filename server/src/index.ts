import express from 'express';
import { expressMiddleware } from '@apollo/server/express4';
import dotenv from 'dotenv';
import connectDB from './utils/database';
import createApolloGraphqlServer from './graphql/server';
import UserService from './controllers/user.controllers';


dotenv.config({ path: './.env' });

async function init() {
    const app = express();
    const PORT = Number(process.env.PORT) || 8000;

    const mongoUri = process.env.MONGO_URI!;
    await connectDB(mongoUri);

    app.use(express.json());

    // Create Apollo GraphQL server
    app.use(
        "/graphql",
        expressMiddleware(await createApolloGraphqlServer(), {
          context: async ({ req }) => {
            // @ts-ignore
            const token = req.headers["token"];
    
            try {
              const user = UserService.decodeJWTToken(token as string);
              return { user };
            } catch (error) {
              return {};
            }
          },
        })
      );
    app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
}

init();
