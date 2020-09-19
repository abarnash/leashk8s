const k8s = require("@pulumi/kubernetes")

const fnRoute = ({fname,ns,port,domain,route}) => {
  return new k8s.apiextensions.CustomResource(
    `${fname}-virtual-service`, {
      apiVersion: 'gateway.solo.io/v1',
      kind: 'VirtualService',
      metadata: {
        name: 'hipy-route',
        namespace: 'gloo-system'
      },
      spec: {
        virtualHost: {
          domains: [domain],
          routes: [{
            matchers: [{
              prefix: route
            }],
            routeAction: {
              single: {
                upstream: {
                  name: `${ns}-${fname}-${port}`,
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
