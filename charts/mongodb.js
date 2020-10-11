let k8s = require("@pulumi/kubernetes");

// Deploy the latest version of the stable/wordpress chart.
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

// // Export the public IP for WordPress.
// let frontend = mongodb.getResource("v1/Service", "mongodb");
// module.exports = {
//   frontendIp: frontend.status.loadBalancer.ingress[0].ip,
// };
