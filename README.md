# Leash K8s

A repository for managing cloud applications on Kubernetes with
Pulumi.

## Install a minikube environment

To run this stack locally, you can install k8s with minikube and
install other dependencies listed here:

[Installation Instructions](docs/minikube.md)

## Run the main dev stack

`pulumi up`

The stack includes
- Knative services
  - helloworld-go
  - helloworld-clj
  - nodefunc
- Kubeless function + route
  - hipy, a python function
  - hipy-virtual-service, a gloo vs to route requests to hipy
