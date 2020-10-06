const knative = require("../resources/knative.js")

const stack = ({
  namespace,
  domain
}) => {
  namespace = namespace || 'default'
  domain = domain || 'localhost'
  const host = namespace.apply(ns => `${ns}.${domain}`)
  //----------------------------------------------------------------------------
  // Accounts service
  const accountsKn = knative.service({
    name: 'accounts',
    namespace: namespace,
    image: 'docker.io/abarnash/accounts',
    env: {
      KN_HOST: host
    }
  })

  //----------------------------------------------------------------------------
  // Reviews service
  const reviewsKn = knative.service({
    name: 'reviews',
    namespace: namespace,
    image: 'docker.io/abarnash/reviews',
    env: {
      KN_HOST: host
    },
  })

  //----------------------------------------------------------------------------
  // Reviews service
  const productsKn = knative.service({
    name: 'products',
    namespace: namespace,
    image: 'docker.io/abarnash/products',
    env: {
      KN_HOST: host
    },
  })

  //----------------------------------------------------------------------------
  // Reviews service
  const inventoryKn = knative.service({
    name: 'inventory',
    namespace: namespace,
    image: 'docker.io/abarnash/inventory',
    env: {
      KN_HOST: host
    },
  })

  //----------------------------------------------------------------------------
  // Reviews service
  const gatewayKn = knative.service({
    name: 'gateway',
    namespace: namespace,
    image: 'abarnash/gateway',
    scale: {
      min: 1
    },
    env: {
      KN_HOST: host
    },
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
