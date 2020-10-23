const knative = require("../resources/knative.js")

const stack = ({
  name,
  namespace = 'default'
}) => {

  const service = knative.service({
    name: 'event-display',
    namespace: namespace,
    scale: {
      max: 10,
      min: 0,
      initial: 1,
      target: 1
    },
    image: 'gcr.io/knative-releases/knative.dev/eventing-contrib/cmd/event_display',
    env: {}
  })

  const byeService = knative.service({
    name: 'event-display-bye',
    namespace: namespace,
    image: 'gcr.io/knative-releases/knative.dev/eventing-contrib/cmd/event_display',
    env: {}
  })

  const senderService = knative.service({
    name: 'event-api',
    namespace: namespace,
    image: 'docker.io/abarnash/event-api',
    env: {
      BROKER_HOST: 'http://broker-ingress.knative-eventing.svc.cluster.local',
      BROKER_PATH: `${namespace}/${name}-broker`
    }
  })

  const ping = knative.ping({
    data: {
      message: 'Hi, Event Ping.'
    },
    name: `${name}-ping`,
    schedule: {
      minute: '*/20'
    },
    sink: service,
    namespace
  })

  const broker = knative.broker({
    name: `${name}-broker`,
    namespace
  })

  const defaultTrigger = knative.trigger({
    broker,
    namespace,
    filter: {
      attributes: {
        type: 'greeting'
      }
    },
    name: `hi-trigger`,
    subscriber: service
  })

  const byeTrigger = knative.trigger({
    broker,
    namespace,
    filter: {
      attributes: {
        source: 'sendoff'
      }
    },
    name: `bye-trigger`,
    subscriber: byeService
  })

  return {
    services: {
      service,
      byeService
    },
    ping,
    broker
  }
}

exports.stack = stack
