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

  return {
    service
  }
}

exports.stack = stack
