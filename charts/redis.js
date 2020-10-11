let k8s = require("@pulumi/kubernetes");

const redis = ({namespace = 'localhost'}) => {
  let chart = new k8s.helm.v3.Chart("redis", {
    namespace,
    chart: "bitnami/redis",
    values: {
      usePassword: false,
      cluster: {
        enabled: false
      }
    }
  })

  return chart
}

exports.redis = redis
