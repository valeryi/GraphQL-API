import { env } from "./environment";
import { apiExplorer } from "./graphql";
import express from "express";
import { ApolloServer } from "apollo-server-express";
import { database } from "./utils/database";
import { logger } from "./utils/logging";
import { verify } from "./utils/jwt";
import confirmRoute from './routes/confirm';

// import depthLimit from 'graphql-depth-limit';

database.init();

apiExplorer.getSchema().then((schema) => {

  // Configure express
  const port = env.PORT;
  const app = express();

  app.use('/confirm', confirmRoute);

  // Configure apollo
  const apolloServer = new ApolloServer({
    schema,
    context: ({ req, res }) => {
      const context = [];

      // verify jwt token
      context.authUser = verify(req, res);

      return context;
    },

    formatError: (error) => {
      logger.error(error);
      // const err = error.extensions.code = 'testing changing code';
      // error.extensions.test = ['test', 'test 2']
      // console.log(err);
      return error;
    },

    // validationRules: [
    //   depthLimit(5)
    // ],

    debug: true

  });
  apolloServer.applyMiddleware({ app });

  app.listen({ port }, () => {
    logger.info(`🚀Server ready at http://localhost:${port}${apolloServer.graphqlPath}`);
  });

})
  .catch((err) => {
    logger.error('Failed to load api at : ', err);
  })

  // TODO: Setup server responses: 200, 401, ...
  // TODO: 404 response and a page when url is broken
  // TODO: N + 1 Problem

