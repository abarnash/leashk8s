const k8s = require("@pulumi/kubernetes")

const makeEnv = (env) =>
  Object.entries(env).map(([name, value]) => ({
    name,
    value
  }))

const service = ({name, env,image, namespace, port}) => {
  namespace = namespace || 'default'
  port = port || 8080

  return new k8s.apiextensions.CustomResource(
    `${name}-knative-service`, {
      apiVersion: 'serving.knative.dev/v1',
      kind: 'Service',
      metadata: {
        name: name,
        namespace: namespace
      },
      spec: {
        template: {
          spec: {
            containers: [{
              image: image,
              env: makeEnv(env),
              ports: [{
                name: `http1`,
                containerPort: port
              }]
            }]
          }
        }
      }
    }, {})
}

exports.service = service
