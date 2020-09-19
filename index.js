const k8s = require("@pulumi/kubernetes")

const appLabels = {
  app: "nginx"
}
const deployment = new k8s.apps.v1.Deployment("nginx", {
  spec: {
    selector: {
      matchLabels: appLabels
    },
    replicas: 1,
    template: {
      metadata: {
        labels: appLabels
      },
      spec: {
        containers: [{
          name: "nginx",
          image: "nginx"
        }]
      }
    }
  }
})

const fn =
  `def handler(event, context):
    return "hello world"
`
const hipyFn = new k8s.apiextensions.CustomResource(
  'hipy-fn', {
    apiVersion: 'kubeless.io/v1beta1',
    kind: 'Function',
    metadata: {
      name: 'hipy',
      namespace: 'default',
      label: {
        'created-by': 'kubeless',
        function: 'hipy'
      }
    },
    spec: {
      runtime: 'python2.7',
      timeout: "180",
      handler: 'hipy.handler',
      deps: "",
      // checksum: sha256:d251999dcbfdeccec385606fd0aec385b214cfc74ede8b6c9e47af71728f6e9a
      'function-content-type': 'text',
      function: fn
    }
  }, {})

const hipyRoute = new k8s.apiextensions.CustomResource(
  'hipy-route', {
    apiVersion: 'gateway.solo.io/v1',
    kind: 'VirtualService',
    metadata: {
      name: 'hipy-route',
      namespace: 'gloo-system'
    },
    spec: {
      virtualHost: {
        domains: ['foo'],
        routes: [
          {
            matchers: [
              { prefix: '/hipy'}
            ],
            routeAction: {
              single: {
                upstream: {
                  name: 'default-hipy-8080',
                  namespace: 'gloo-system'
                }
              }
            }
          }
        ]
      }
    }
  }, {})

exports.name = deployment.metadata.name

exports.fn = hipyFn.metadata.name
