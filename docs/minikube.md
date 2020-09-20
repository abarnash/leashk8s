## Install a Local K8s Development Cluster with Minikube

To run the `leashk8s` stack locally you will need
 - minikube for hosting k8s (via virtualbox)
 - kubectl, k8s command line tool
 - helm, package manager for k8s
 - gloo, an API Gateway for k8s
 - knative, a serverless framework for k8s
 - kubeless, a faas framework for k8s


### Install kubectl

#### MacOs
`brew install kubectl`

More details:
https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-macos

#### Linux

```
sudo apt-get update && sudo apt-get install -y apt-transport-https gnupg2
curl -s https://packages.cloud.google.com/apt/doc/apt-key.gpg | sudo apt-key add -
echo "deb https://apt.kubernetes.io/ kubernetes-xenial main" | sudo tee -a /etc/apt/sources.list.d/kubernetes.list
sudo apt-get update
sudo apt-get install -y kubectl
```

More details:
https://kubernetes.io/docs/tasks/tools/install-kubectl/#install-kubectl-on-linux

### Install minikube

If you do not already have virtualbox, install that first:
https://www.virtualbox.org/wiki/Downloads

#### MacOs
Install with homebrew:
`brew install minikube`

#### Linux
From binary:
```
curl -Lo minikube https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 \
  && chmod +x minikube
```

Add executable to path:
```
sudo mkdir -p /usr/local/bin/
sudo install minikube /usr/local/bin/
```
### Start a Kubernetes cluster with Minikube
To start a minikube cluster with 2 cpus and 4g memory allocated:
`minikube start --cpus 2 --memory 4096 --kubernetes-version v1.17.0`

* Note using version 1.17.0 of kubernetes because as of 9/19/2020
knative was not compatible with v1.19.0.

### Install helm

#### MacOs
`brew install helm`

#### Linux- apt
```
curl https://baltocdn.com/helm/signing.asc | sudo apt-key add -
sudo apt-get install apt-transport-https --yes
echo "deb https://baltocdn.com/helm/stable/debian/ all main" | sudo tee /etc/apt/sources.list.d/helm-stable-debian.list
sudo apt-get update
sudo apt-get install helm
```

More details:
https://helm.sh/docs/intro/install/

### Install gloo + knative

#### Install glooctl
`brew install solo-io/tap/glooctl`

or

`curl -sL https://run.solo.io/gloo/install | sh
  export PATH=$HOME/.gloo/bin:$PATH`

#### Install knative and gloo via Helm

Install knative on the k8s cluster
```
glooctl install knative -g
kubectl get all -n knative-serving

```

Install gloo on k8s
```
helm repo add gloo https://storage.googleapis.com/solo-public-helm
helm repo update

kubectl describe namespace knative-serving
```

Save this `values.yaml` file locally:
```yaml
gateway:
  enabled: false
settings:
  integrations:
    knative:
      enabled: true
      version: {{ . }}  # put installed knative version here!
```

And run:
```
kubectl create namespace gloo-system
helm install gloo gloo/gloo --namespace gloo-system -f values.yaml
```

More details:
https://docs.solo.io/gloo/latest/installation/knative/#installing-on-kubernetes-with-helm

#### Install kubeless

```
kubectl create ns kubeless
kubectl create -f https://github.com/kubeless/kubeless/releases/download/v1.0.7/kubeless-v1.0.7.yaml
```
