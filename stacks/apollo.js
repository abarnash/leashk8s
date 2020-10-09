const knative = require("../resources/knative.js")

const stack = ({
  namespace,
  domain
}) => {
  namespace = namespace || 'default'
  domain = domain || 'localhost'
  const host = `${namespace}.${domain}` // namespace.apply(ns => `${ns}.${domain}`)
  const APP_NAME = 'apollo'
  //----------------------------------------------------------------------------
  // Accounts service

  const accountsKn = knative.service({
    name: 'accounts',
    namespace: namespace,
    image: 'docker.io/abarnash/accounts',
    env: {
      KN_HOST: host,
      KN_PORT: '8080'
    },
    app: APP_NAME
  })

  //----------------------------------------------------------------------------
  // Reviews service
  const reviewsKn = knative.service({
    name: 'reviews',
    namespace: namespace,
    image: 'docker.io/abarnash/reviews',
    env: {
      KN_HOST: host,
      KN_PORT: '8080'
    },
    app: APP_NAME
  })

  //----------------------------------------------------------------------------
  // Reviews service
  const productsKn = knative.service({
    name: 'products',
    namespace: namespace,
    image: 'docker.io/abarnash/products',
    env: {
      KN_HOST: host,
      KN_PORT: '8080'
    },
    app: APP_NAME
  })

  //----------------------------------------------------------------------------
  // Reviews service
  const inventoryKn = knative.service({
    name: 'inventory',
    namespace: namespace,
    image: 'docker.io/abarnash/inventory',
    env: {
      KN_HOST: host,
      KN_PORT: '8080'
    },
    app: APP_NAME
  })

  //----------------------------------------------------------------------------
  // Reviews service
  const gatewayKn = knative.service({
    name: 'gateway',
    namespace: namespace,
    image: 'docker.io/abarnash/gateway',
    scale: {
      min: 1
    },
    env: {
      KN_HOST: host,
      KN_PORT: '8080',
      KN_SERVICE_LIST: JSON.stringify([{
          name: "accounts",
          url: `http://accounts.${host}/graphql`
        },
        {
          name: "reviews",
          url: `http://reviews.${host}/graphql`
        },
        {
          name: "products",
          url: `http://products.${host}/graphql`
        },
        {
          name: "inventory",
          url: `http://inventory.${host}/graphql`
        }
      ])
    },
    app: APP_NAME
  })

  return {
    accountsKn,
    reviewsKn,
    inventoryKn,
    productsKn,
    gatewayKn
  }

}

exports.stack = stack
