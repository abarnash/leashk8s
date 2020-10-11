import express from 'express';
import { createServer } from 'http';
import { PubSub } from 'apollo-server';
import { ApolloServer, gql } from 'apollo-server-express';

import { MongoClient } from 'mongodb'

const {
  KN_HOST = 'localhost',
  KN_PORT = '4005',
  MONGODB_SERVICE_HOST = 'localhost',
  MONGODB_SERVICE_PORT = '27017',
  REDIS_MASTER_SERVICE_HOST = 'localhost',
  REDIS_MASTER_SERVICE_PORT = '6379'
} = process.env

const port = parseInt(KN_PORT)
// import Users from './data-sources/Users.js'

// const client = new MongoClient('mongodb://localhost:27017/test')
// (async () => {
//   await client.connect()
// })

const app = express();

app.use(express.static('public'))

const pubsub = new PubSub();
const MESSAGE_CREATED = 'MESSAGE_CREATED';

const typeDefs = gql`
  type User {
    id: String!
    username: String!
  }

  type Query {
    messages: [Message!]!
    me: User
  }

  type Subscription {
    messageCreated: Message
  }

  type Message {
    id: String
    content: String
  }
`;

const resolvers = {
  Query: {
    messages: () => [
      { id: 0, content: 'Hello!' },
      { id: 1, content: 'Bye!' },
    ],
  },
  Subscription: {
    messageCreated: {
      subscribe: () => pubsub.asyncIterator(MESSAGE_CREATED),
    },
  },
};

const server = new ApolloServer({
  typeDefs,
  resolvers,
  dataSources: () => ({
    // users: new UserAPI(client.db().collection('users'))
    // OR
    // users: new Users(UserModel)
  })
});

server.applyMiddleware({ app, path: '/graphql' });

const httpServer = createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen({ port: port }, () => {
  console.log(`Apollo Server on http://${KN_HOST}:${port}/graphql`);
});

let id = 2;

setInterval(() => {
  pubsub.publish(MESSAGE_CREATED, {
    messageCreated: { id, content: new Date().toString() },
  });

  id++;
}, 1000);
