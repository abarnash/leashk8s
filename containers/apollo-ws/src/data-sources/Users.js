const uuidv4 = require('uuid/v4');
const { DataSource } = require('apollo-datasource');

class UserAPI extends DataSource {
  constructor({ collection }) {
    super();
    this.store = collection;
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
  async findOrCreateUser({email} = {}) {
    const user = await this.collection.findOne({email})
    if (user) {
      return user.id
    }
    else {
      const newUser = await this.collection.insert({email})
      return newUser
    }
    // const email =
    //   this.context && this.context.user ? this.context.user.email : emailArg;
    // if (!email || !isEmail.validate(email)) return null;
    //
    // const users = await this.store.users.findOrCreate({ where: { email } });
    // return users && users[0] ? users[0] : null;
  }
}

module.exports = UserAPI;
