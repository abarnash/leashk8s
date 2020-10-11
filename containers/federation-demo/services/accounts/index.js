const {
  ApolloServer,
  gql
} = require("apollo-server")
const {
  buildFederatedSchema
} = require("@apollo/federation")
const UserAPI = require('./data-sources/Users.js')
const {
  MongoClient
} = require('mongodb')



const {
  KN_PORT,
  MONGODB_SERVICE_HOST = 'localhost',
  MONGODB_SERVICE_PORT = '27017'
} = process.env

const users = [{
    id: "1",
    name: "Ada Lovelace",
    birthDate: "1815-12-10",
    username: "@ada"
  },
  {
    id: "2",
    name: "Alan Turing",
    birthDate: "1912-06-23",
    username: "@complete"
  }
];

const port = KN_PORT && parseInt(KN_PORT) || 4001
const mongoPort = parseInt(MONGODB_SERVICE_PORT)

const mongoUri = `mongodb://${MONGODB_SERVICE_HOST}:${mongoPort}/accounts`

const client = new MongoClient(mongoUri)

const connect = async () => {
  await client.connect()
  console.log('Connected.')
  await client.db().collection('users').findOneAndUpdate({
    id: 1
  }, {
    $set: users[0]
  }, {
    upsert: true
  })
  await client.db().collection('users').insertOne({
    id: 2
  }, {
    $set: users[1]
  }, {
    upsert: true
  })
}
connect()

const typeDefs = gql `
  extend type Query {
    me: User,
    user(username: String!): User,
  }

  type Mutation {
    # if false, signup failed -- check errors
    newUser(username: String!, name: String): NewUserResponse!
  }

  type NewUserResponse {
    success: Boolean!
    message: String
    user: User
  }

  type User @key(fields: "id") {
    id: ID!
    name: String
    username: String
  }
`;

const resolvers = {
  Query: {
    me(_, {}, {
      dataSources
    }) {
      return dataSources.users.findUser({
        username: '@complete'
      })
    },
    user(_, {username}, {dataSources}){
      return dataSources.users.findUser({username})
    }
  },
  Mutation: {
    newUser: async (_, {
      username,
      name
    }, {
      dataSources
    }) => {
      const col = dataSources.users
      const isUser = await col.findUser({username})
      if (isUser){
        return {
          success: false,
          message: `${username} already exists!`
        }
      }

      const newUser = await col.createUser({username, name})

      return {
        success: true,
        message: `${newUser.username} created!`,
        user: newUser
      }

    }
  },
  User: {
    __resolveReference(object) {
      return users.find(user => user.id === object.id);
    }
  }
};

const server = new ApolloServer({
  schema: buildFederatedSchema([{
    typeDefs,
    resolvers,

  }]),
  dataSources: () => ({
    users: new UserAPI(client.db().collection('users'))
  })

});

server.listen({
  port: port
}).then(({
  url
}) => {
  console.log(`🚀 Server ready at ${url}`);
});
