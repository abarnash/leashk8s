import React from 'react'
import ReactDOM from 'react-dom'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { getMainDefinition } from 'apollo-utilities'
import { ApolloLink, split } from 'apollo-link'
import { HttpLink } from 'apollo-link-http'
import { WebSocketLink } from 'apollo-link-ws'
import { InMemoryCache } from 'apollo-cache-inmemory'

import App from './App'

const {
  APOLLO_WS_HOST = 'localhost',
  APOLLO_WS_PORT = '4005',
  APOLLO_HTTP_HOST = 'localhost',
  APOLLO_HTTP_PORT = '4005'
} = process.env

const apolloWSUri = `ws://${APOLLO_WS_HOST}:${APOLLO_WS_PORT}/graphql`
const apolloHTTPUri = `http://${APOLLO_HTTP_HOST}:${APOLLO_HTTP_PORT}/graphql`

console.log(apolloWSUri, apolloHTTPUri)

const httpLink = new HttpLink({
  uri: apolloHTTPUri,
})

const wsLink = new WebSocketLink({
  uri: apolloWSUri,
  options: {
    reconnect: true,
  },
})

const terminatingLink = split(
  ({ query }) => {
    const { kind, operation } = getMainDefinition(query)
    return (
      kind === 'OperationDefinition' && operation === 'subscription'
    )
  },
  wsLink,
  httpLink,
)

const link = ApolloLink.from([terminatingLink])

const cache = new InMemoryCache()

const client = new ApolloClient({
  link,
  cache,
})

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root'),
)
