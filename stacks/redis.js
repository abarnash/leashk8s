// index.ts

const k8s = require("@pulumi/kubernetes")
const pulumi = require("@pulumi/pulumi")

// Minikube does not implement services of type `LoadBalancer` require the user to specify if we're
// running on minikube, and if so, create only services of type ClusterIP.
const config = new pulumi.Config()

//
// REDIS LEADER.
//

const stack = ({
  namespace,
  replica
}) => {
  namespace = namespace || 'default'

  const redisLeaderLabels = {
    app: "redis-leader"
  }

  const redisLeaderDeployment = new k8s.apps.v1.Deployment("redis-leader", {
    metadata: {
      namespace
    },
    spec: {
      selector: {
        matchLabels: redisLeaderLabels
      },
      template: {
        metadata: {
          labels: redisLeaderLabels
        },
        spec: {
          containers: [{
            name: "redis-leader",
            image: "redis",
            resources: {
              requests: {
                cpu: "100m",
                memory: "100Mi"
              }
            },
            ports: [{
              containerPort: 6379
            }],
          }, ],
        },
      },
    },
  })

  const redisLeaderService = new k8s.core.v1.Service("redis-leader", {
    metadata: {
      name: "redis-leader",
      labels: redisLeaderDeployment.metadata.labels,
      namespace
    },
    spec: {
      ports: [{
        port: 6379,
        targetPort: 6379
      }],
      selector: redisLeaderDeployment.spec.template.metadata.labels,
    },
  })

  let output = {
    redisLeaderService
  }

  //
  // REDIS REPLICA.
  //

  if (replica) {
    const redisReplicaLabels = {
      app: "redis-replica"
    }

    const redisReplicaDeployment = new k8s.apps.v1.Deployment("redis-replica", {
      metadata: {
        namespace
      },
      spec: {
        selector: {
          matchLabels: redisReplicaLabels
        },
        template: {
          metadata: {
            labels: redisReplicaLabels
          },
          spec: {
            containers: [{
              name: "replica",
              image: "pulumi/guestbook-redis-replica",
              resources: {
                requests: {
                  cpu: "100m",
                  memory: "100Mi"
                }
              },
              // If your cluster config does not include a dns service, then to instead access an environment
              // variable to find the leader's host, change `value: "dns"` to read `value: "env"`.
              env: [{
                name: "GET_HOSTS_FROM",
                value: "dns"
              }],
              ports: [{
                containerPort: 6379
              }],
            }, ],
          },
        },
      },
    })

    const redisReplicaService = new k8s.core.v1.Service("redis-replica", {
      metadata: {
        name: "redis-replica",
        labels: redisReplicaDeployment.metadata.labels,
        namespace
      },
      spec: {
        ports: [{
          port: 6379,
          targetPort: 6379
        }],
        selector: redisReplicaDeployment.spec.template.metadata.labels,
      },
    })

    output = {...output, redisReplicaService}
  }

  return output
}

exports.stack = stack
