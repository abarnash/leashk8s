let k8s = require("@pulumi/kubernetes");

const db = ({namespace = 'localhost'}) => {
  let mongodb = new k8s.helm.v3.Chart("mongodb", {
    namespace,
    chart: "bitnami/mongodb",
    values: {
      architecture: 'standalone',
      useStatefulSet: true,
      auth: {
        enabled: false
      }
    }
  })

  return db
}

exports.db = db
