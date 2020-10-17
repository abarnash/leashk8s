const k8s = require("@pulumi/kubernetes")

const makeEnv = (env) =>
  Object.entries(env).map(([name, value]) => ({
    name,
    value
  }))

const makeScale = ({
  min,
  max,
  initial
}) => {
  min = min && String(min) || '0'
  max = max && String(max) || '1'
  initial = initial && String(initial) || '1'
  return {
    'autoscaling.knative.dev/class': 'kpa.autoscaling.knative.dev',
    'autoscaling.knative.dev/metric': 'concurrency',
    'autoscaling.knative.dev/initialScale': initial,
    'autoscaling.knative.dev/minScale': min,
    'autoscaling.knative.dev/maxScale': max
  }
}

const makeTraffic = name => ({
  version,
  percent
}) => {
  if (version === 'latest') {
    return {
      tag: 'latest',
      latestRevision: true,
      percent
    }
  } else {
    return {
      tag: `v${version}`,
      revisionName: `${name}-v${version}`,
      percent
    }
  }
}

const service = ({
  name,
  env,
  image,
  scale,
  namespace,
  port,
  app,
  version = '0',
  traffic
}) => {
  namespace = namespace || 'default'
  port = port || 8080
  scale = scale || {}
  scaleAnnotations = makeScale(scale)
  app = app || name

  let labels = {
    app
  }

  let top_labels = []

  let crd = {
    apiVersion: 'serving.knative.dev/v1',
    kind: 'Service',
    metadata: {
      name: name,
      namespace: namespace
    },
    spec: {
      template: {
        metadata: {
          annotations: {
            ...scaleAnnotations
          },
          name: `${name}-v${version}`,
          labels
        },
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
  }

  if (traffic) {
    crd.spec.traffic = traffic.map(makeTraffic(name))
  }

  console.log(crd.spec.traffic)

  return new k8s.apiextensions.CustomResource(
    `${name}-knative-service`,
    crd, {})
}

exports.service = service
