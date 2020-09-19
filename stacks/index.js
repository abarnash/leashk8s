const k8s = require("@pulumi/kubernetes")
const gloo = require("../resources/gloo.js")
const kubeless = require("../resources/kubeless.js")

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
