const k8s = require("@pulumi/kubernetes")
const gloo = require("../resources/gloo.js")
const kubeless = require("../resources/kubeless.js")
const knative = require("../resources/knative.js")
const contour = require("../resources/contour.js")
const docker = require("@pulumi/docker")

const redisStack = require("./redis.js")
const apolloStack = require("./apollo.js")

const DOMAIN = 'cloudleash.org'

const nodeRedisImage = new docker.RemoteImage("node-redis", {
  name: "abarnash/nodefunc"
})

const ns = new k8s.core.v1.Namespace('leashk8s-dev', {
  metadata: {
    name: 'leashk8s-dev'
  }
})

const NAMESPACE_LABEL = ns.metadata.name;

const appLabels = {
  app: "nginx"
}

const redis = redisStack.stack({
  namespace: NAMESPACE_LABEL
})

const apollo = apolloStack.stack({
  domain: DOMAIN,
  namespace: NAMESPACE_LABEL
})

const nodeRedis = knative.service({
  name: 'node-redis',
  namespace: NAMESPACE_LABEL,
  image: nodeRedisImage.latest,
  env: {
    REDIS_HOST: 'redis-master'
  }
})

const knRubyService = knative.service({
  name: 'helloworld-ruby',
  namespace: NAMESPACE_LABEL,
  image: 'docker.io/abarnash/helloworld-ruby',
  env: {
    TARGET: 'Friend of Leash'
  }
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

exports.namespace = NAMESPACE_LABEL
