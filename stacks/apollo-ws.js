const knative = require("../resources/knative.js")

const stack = ({
  namespace,
  domain
}) => {
  namespace = namespace || 'default'
  domain = domain || 'localhost'
  const host = `${namespace}.${domain}` // namespace.apply(ns => `${ns}.${domain}`)
  const APP_NAME = 'apollo-ws'

  //----------------------------------------------------------------------------
  // Accounts service

  // const clientKn = knative.service({
  //   name: 'apollo-client',
  //   namespace: namespace,
  //   image: 'abarnash/apollo-client',
  //   env: {
  //     KN_HOST: host,
  //     KN_PORT: '80',
  //     APOLLO_WS_HOST: `apollo-ws.${host}`,
  //     APOLLO_WS_PORT: '8080',
  //     APOLLO_HTTP_HOST: `apollo-ws.${host}`,
  //     APOLLO_HTTP_PORT: '8080'
  //   },
  //   app: APP_NAME,
  //   port: 80
  // })

  const wsServerKn = knative.service({
    name: 'apollo-ws',
    namespace: namespace,
    image: 'docker.io/abarnash/apollo-ws',
    env: {
      KN_HOST: host,
      KN_PORT: '8080',
      APOLLO_WS_HOST: `apollo-ws.${host}`,
      APOLLO_WS_PORT: '8080',
      APOLLO_HTTP_HOST: `apollo-ws.${host}`,
      APOLLO_HTTP_PORT: '8080'
    },
    app: APP_NAME
  })

  return {
    // clientKn,
    wsServerKn
  }

}

exports.stack = stack
