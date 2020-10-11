const {
  v4
} = require('uuid');
const {
  DataSource
} = require('apollo-datasource');

class UserAPI extends DataSource {
  constructor(collection) {
    super()
    this.collection = collection
  }

  /**
   * This is a function that gets called by ApolloServer when being setup.
   * This function gets called with the datasource config including things
   * like caches and context. We'll assign this.context to the request context
   * here, so we can know about the user making requests
   */
  initialize(config) {
    this.context = config.context;
  }

  /**
   * User can be called with an argument that includes email, but it doesn't
   * have to be. If the user is already on the context, it will use that user
   * instead
   */
  async findOrCreateUser({
    username
  } = {}) {
    const user = await this.collection.findOne({
      username
    })
    if (user) {
      return user.id
    } else {
      const newUser = await this.collection.insertOne({
        username,
        id: v4()
      })
      return newUser.id
    }
  }

  async createUser({
    username,
    name
  }) {
    return await this.collection.insertOne({
      username,
      name,
      id: v4()
    }).then(({ ops }) => ops[0])
  }

  async findUser({
    username
  } = {}) {
    return await this.collection.findOne({
      username
    })
  }

}

module.exports = UserAPI;
