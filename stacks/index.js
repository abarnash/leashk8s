const k8s = require("@pulumi/kubernetes")
const gloo = require("../resources/gloo.js")
const kubeless = require("../resources/kubeless.js")
const knative = require("../resources/knative.js")
const contour = require("../resources/contour.js")

const apolloStack = require("./apollo.js")
const apolloWSStack = require("./apollo-ws.js")

const mongo = require("../charts/mongodb.js")
const redisChart = require("../charts/redis.js")

const DOMAIN = 'cloudleash.org'

const NAMESPACE_LABEL = process.env.PULUMI_NODEJS_STACK

const ns = new k8s.core.v1.Namespace(NAMESPACE_LABEL, {
  metadata: {
    name: NAMESPACE_LABEL
  }
})

const mongodb = mongo.db({
  namespace: NAMESPACE_LABEL
})

const redis = redisChart.redis({
  namespace: NAMESPACE_LABEL
})

const apolloWS = apolloWSStack.stack({
  domain: DOMAIN,
  namespace: NAMESPACE_LABEL
})

const apollo = apolloStack.stack({
  domain: DOMAIN,
  namespace: NAMESPACE_LABEL
})

const nodeRedis = knative.service({
  name: 'node-redis',
  namespace: NAMESPACE_LABEL,
  image: "docker.io/abarnash/nodefunc",
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
  version: '3',
  image: 'docker.io/abarnash/helloworld-clj',
  env: {
    TARGET: 'Friendish of Leash',
    SOURCE: 'Leash'
  },
  traffic: [
    {
      version: '1',
      percent: 10
    },
    {
      version: '2',
      percent: 70
    },
    {
      version: 'latest',
      percent: 20
    }
  ]
})

const knGoService = knative.service({
  name: 'helloworld-go',
  namespace: NAMESPACE_LABEL,
  scale: {
    max: 5,
    min: 0,
    initial: 2,
    target: 10
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
