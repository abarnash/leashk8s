const k8s = require("@pulumi/kubernetes")
const gloo = require("../resources/gloo.js")
const kubeless = require("../resources/kubeless.js")
const knative = require("../resources/knative.js")
const contour = require("../resources/contour.js")


const ns = new k8s.core.v1.Namespace('leashk8s-dev')

// Export the Namespace name
const NAMESPACE_LABEL = ns.metadata.name;

const appLabels = {
  app: "nginx"
}

const knService = knative.service({
  name: 'nodefunc',
  namespace: NAMESPACE_LABEL,
  image: 'docker.io/abarnash/nodefunc',
  env: {
    TARGET: 'Friend of Leash',
    SOURCE: 'Leash'
  }
})

const knGoService = knative.service({
  name: 'helloworld-go',
  namespace: NAMESPACE_LABEL,
  scale: {
    max: 2,
    min: 0,
    initial: 2
  },
  image: 'gcr.io/knative-samples/helloworld-go',
  env: {
    TARGET: 'Yo Leash'
  }
})

const wsNodeSvc = knative.service({
  name: 'node-ws',
  namespace: NAMESPACE_LABEL,
  image: 'docker.io/abarnash/node-ws',
  scale: {
    max: 1
  },
  env: {
    TARGET: 'Leash'
  }
})

const fnGateway = contour.httpGateway({
  name: 'ws-gateway',
  namespace: NAMESPACE_LABEL,
  hosts: [{
    host: 'www.cloudleash.org',
    paths: [{
      path: '/',
      name: 'node-ws-hhh27'
    }]
  }]
})

const knCljService = knative.service({
  name: 'helloworld-clj',
  namespace: NAMESPACE_LABEL,
  image: 'docker.io/abarnash/helloworld-clj',
  env: {
    TARGET: 'Friend of Leash',
    SOURCE: 'Leash'
  }
})

exports.namespace = NAMESPACE_LABEL
