# Leash K8s

A repository for managing cloud applications on Kubernetes with
Pulumi.

## Install a local Kubernetes development environment

To run this stack locally, you can install k8s with something like microK8s (runs natively), minikube (runs in a VM) or kind (runs in docker).

[microK8s Installation Instructions](docs/microk8s.md)
[Minikube Installation Instructions](docs/minikube.md)

## Run the main dev stack

`pulumi up`

### Knative container services

To get a list of the knative services running:

`kn service list`

Test services:
  - helloworld-go
    ```
    curl -H "Host: helloworld-go.default.example.com" $(glooctl proxy url --name knative-external-proxy)
    ```
  - helloworld-clj
    ```
    curl -H "Host: helloworld-clj.default.example.com" $(glooctl proxy url --name knative-external-proxy)
    ```
  - nodefunc
    ```
    curl -H "Host: nodefunc.default.example.com" $(glooctl proxy url --name knative-external-proxy)
    ```

### Kubeless function service

The stack includes a kubeless python function and a gloo virtual service that routes network traffic matching the `/hipy` route to the hipy function.

```
curl -v -H "Host: fns" $(glooctl proxy url)/hipy
```
