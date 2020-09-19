const k8s = require("@pulumi/kubernetes")
const gloo = require("../resources/gloo.js")
const kubeless = require("../resources/kubeless.js")
const knative = require("../resources/knative.js")

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

const knService = knative.service({
  name: 'nodefunc-2',
  image: 'docker.io/abarnash/nodefunc',
  env: {
    TARGET: 'Friend of Leash',
    SOURCE: 'Leash'
  }
})

const knGoService = knative.service({
  name: 'helloworld-go',
  image: 'gcr.io/knative-samples/helloworld-go',
  env: {
    TARGET: 'Yo Leash'
  }
})

const hipyFn = kubeless.fn({
  name: 'hipy',
  fnPath: '../fns/hi.py'
})

const hipyRoute = gloo.fnRoute({
  domain: 'fns',
  fname: 'hipy',
  namespace: 'default',
  port: '8080',
  route: '/hipy'
})

exports.name = deployment.metadata.name

exports.fn = hipyFn.name
