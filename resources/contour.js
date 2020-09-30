const k8s = require("@pulumi/kubernetes")

const makePath = ({
  path,
  name,
  port
}) => {
  port = port || 8080
  path = path || "/"
  return {
    path,
    backend: {
      serviceName: name,
      servicePort: port
    }
  }
}

const makeRule = ({
  host,
  paths
}) => {
  return {
    host,
    http: {
      paths: paths.map(makePath)
    }
  }
}

const httpGateway = ({
  name,
  namespace,
  hosts
}) => {
  namespace = namespace || 'default'

  return new k8s.networking.v1beta1.Ingress(`http-gateway-${name}`, {
    metadata: {
      name,
      namespace
    },
    spec: {
      rules: hosts.map(makeRule)
    }
  })
}

exports.httpGateway = httpGateway
