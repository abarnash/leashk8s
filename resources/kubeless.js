const k8s = require("@pulumi/kubernetes")
const fs = require('fs')
const path = require('path')

const fn = ({
  fnPath,
  name,
  handler,
  namespace,
  runtime,
  timeout
}) => {
  const fnText = fs.readFileSync(path.resolve(__dirname, fnPath), 'utf8')

  const fn = new k8s.apiextensions.CustomResource(
    `${name}-fn`, {
      apiVersion: 'kubeless.io/v1beta1',
      kind: 'Function',
      metadata: {
        name: name,
        namespace: namespace || 'default',
        label: {
          'created-by': 'kubeless',
          function: name
        }
      },
      spec: {
        runtime: runtime || 'python3.4',
        timeout: timeout || "180",
        handler: handler || `${name}.handler`,
        deps: "",
        'function-content-type': 'text',
        function: fnText
      }
    }, {})

    return {
      fn,
      name: name,
      upstream: `${namespace}-${name}-8080`
    }
}

exports.fn = fn
