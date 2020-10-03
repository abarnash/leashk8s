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
  image: 'gcr.io/knative-samples/helloworld-go',
  env: {
    TARGET: 'Yo Leash'
  }
})

const wsNodeSvc = knative.service({
  name: 'node-ws',
  namespace: NAMESPACE_LABEL,
  image: 'docker.io/abarnash/node-ws',
  env: {
    TARGET: 'Leash'
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

const hipyFn = kubeless.fn({
  name: 'hipy',
  namespace: NAMESPACE_LABEL,
  fnPath: '../fns/hi.py'
})

const fnGateway = contour.httpGateway({
  name: 'fn-gateway',
  namespace: NAMESPACE_LABEL,
  hosts: [{
    host: 'fn.example.com',
    paths: [{
      path: '/hipy/',
      name: hipyFn.name
    }]
  }]
})


// const ingress = new k8s.networking.v1beta1.Ingress("test-ingress", {
//   metadata: {
//     name: 'test-ingress',
//     // namespace: NAMESPACE_LABEL
//   },
//   spec: {
//     rules: [{
//       host: 'fntest.example.com',
//       http: {
//         paths: [{
//           backend: {
//             serviceName: hipyFn.fn.metadata.name,
//             servicePort: 8080
//           }
//         }]
//       }
//
//     }]
//   }
// });

// const hipyRoute = gloo.fnRoute({
//   domain: 'fns',
//   fname: 'hipy',
//   namespace: NAMESPACE_LABEL,
//   port: '8080',
//   route: '/hipy'
// })

// const redis = new k8s.helm.v2.Chart('redis', {
//     repo: "bitnami",
//     chart: "redis",
//     version: "11.0.0"
// })
//
// const redisSecret = redis.getResource('default/redis')
// console.log(redisSecret.allResources())
// const redisHost =  redis.spec.clusterIP

// exports.name = deployment.metadata.name

exports.namespace = NAMESPACE_LABEL

exports.fn = hipyFn.name
exports.hipyfn = hipyFn.metadata
