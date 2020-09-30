const k8s = require("@pulumi/kubernetes")

const fnRoute = ({fname,namespace,port,domain,route,upstream}) => {
  namespace = namespace || 'default'
  port = port || '8080'
  domain = domain || 'api'

  return new k8s.apiextensions.CustomResource(
    `${fname}-virtual-service`, {
      apiVersion: 'gateway.solo.io/v1',
      kind: 'VirtualService',
      metadata: {
        name: fname,
        namespace: namespace
      },
      spec: {
        virtualHost: {
          domains: [domain],
          routes: [{
            matchers: [{
              prefix: route || '/'
            }],
            routeAction: {
              single: {
                upstream: {
                  name: upstream || `${namespace}-${fname}-${port}`,
                  namespace: 'gloo-system'
                }
              }
            }
          }]
        }
      }
    }, {})
}

exports.fnRoute = fnRoute
