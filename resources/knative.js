const k8s = require("@pulumi/kubernetes")

const makeEnv = (env) =>
  Object.entries(env).map(([name, value]) => ({
    name,
    value
  }))

const makeScale = ({
  min,
  max,
  initial,
  target
}) => {
  min = min && String(min) || '0'
  max = max && String(max) || '1'
  initial = initial && String(initial) || '1'
  let autoscale = {
    'autoscaling.knative.dev/class': 'kpa.autoscaling.knative.dev',
    'autoscaling.knative.dev/metric': 'concurrency',
    'autoscaling.knative.dev/target': target,
    'autoscaling.knative.dev/initialScale': initial,
    'autoscaling.knative.dev/minScale': min,
    'autoscaling.knative.dev/maxScale': max
  }

  if (target) {
    autoscale['autoscaling.knative.dev/target'] = String(target)
  }

  return autoscale
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

  return new k8s.apiextensions.CustomResource(
    `${name}-knative-service`,
    crd, {})
}

exports.service = service

const makeSchedule = ({
  minute = '*',
  hour = '*',
  month = '*',
  dayOfMonth = '*',
  dayOfWeek = '*'
}) => `${minute} ${hour} ${dayOfMonth} ${month} ${dayOfWeek}`

exports.ping = ({
  data = {},
  schedule = {
    minute: '*/1'
  },
  name,
  namespace,
  sink
}) => {

  const cronEvent = {
    apiVersion: 'sources.knative.dev/v1beta1',
    kind: 'PingSource',
    metadata: {
      name,
      namespace
    },
    spec: {
      schedule: makeSchedule(schedule),
      jsonData: JSON.stringify(data),
      sink: {
        ref: {
          apiVersion: sink.apiVersion,
          kind: sink.kind,
          name: sink.metadata.name
        }
      }
    }
  }
  return new k8s.apiextensions.CustomResource(
    `${name}-kn-ping`,
    cronEvent, {})
}

exports.broker = ({
  name,
  namespace
}) => {
  const broker = {
    apiVersion: 'eventing.knative.dev/v1',
    kind: 'Broker',
    metadata: {
      name,
      namespace
    },
    spec: {}
  }
  return new k8s.apiextensions.CustomResource(name, broker)
}

exports.trigger = ({
  broker,
  filter,
  name,
  namespace,
  subscriber
}) => {
  let trigger = {
    apiVersion: 'eventing.knative.dev/v1',
    kind: 'Trigger',
    metadata: {
      name,
      namespace
    },
    spec: {
      broker: broker.metadata.name,
      subscriber: {
        ref: {
          apiVersion: subscriber.apiVersion,
          kind: subscriber.kind,
          name: subscriber.metadata.name
        }
      }
    }
  }

  if (filter) {
    trigger.spec.filter = filter
  }

  return new k8s.apiextensions.CustomResource(name, trigger)
}
