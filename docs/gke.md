# Creating a GKE cluster

## See instructions for configuring gcloud + project + kubectl
You will need to have acess to a Google Cloud account, and the `gcloud` and `kubectl` command line tools.
You can either create your own Google Cloud project and follow the instructions to deploy there, or you can request access to your friend Leash's cloud.

Kubectl instructions:
https://kubernetes.io/docs/tasks/tools/install-kubectl/

Gcloud instructions:
https://cloud.google.com/kubernetes-engine/docs/quickstart


## Create a GKE cluster
Once you have gcloud installed and authorized, you can create a cluster with the following:

```sh
export CLUSTER_NAME=leash-dev
export CLUSTER_ZONE=us-east4-c
gcloud container clusters create $CLUSTER_NAME \
  --zone=$CLUSTER_ZONE \
  --cluster-version=latest \
  --machine-type=n1-standard-4 \
  --enable-autoscaling --min-nodes=1 --max-nodes=10 \
  --enable-autorepair \
  --scopes=service-control,service-management,compute-rw,storage-ro,cloud-platform,logging-write,monitoring-write,pubsub,datastore \
  --num-nodes=3
```

## Install knative with ingress

You can use the shell scripts in the `/addons` directory to install knative with
either Ambassador or Contour as your Ingress.

Ambassador:
`chmod +x addons/ambassador-knative.sh && sh addons/ambassador-knative.sh`

Contour:
`chmod +x addons/contour-knative.sh && sh addons/contour-knative.sh`

## Install knative with contour
You can install the Knative serverless framework on your k8s cluster with the following commands.
(This install is using contour in place of Istio, uses less resources I *think*)

```sh
kubectl apply --filename https://github.com/knative/serving/releases/download/v0.18.0/serving-crds.yaml

kubectl apply --filename https://github.com/knative/serving/releases/download/v0.18.0/serving-core.yaml


kubectl apply --filename https://github.com/knative/net-contour/releases/download/v0.18.0/contour.yaml

kubectl apply --filename https://github.com/knative/net-contour/releases/download/v0.18.0/net-contour.yaml

kubectl patch configmap/config-network \
  --namespace knative-serving \
  --type merge \
  --patch '{"data":{"ingress.class":"contour.ingress.networking.knative.dev"}}'

```

You can check the knative install with
`kubectl get all -n knative-serving`

## Install Kubeless (Optional)
```sh
kubectl create ns kubeless
kubectl create -f https://github.com/kubeless/kubeless/releases/download/v1.0.7/kubeless-v1.0.7.yaml
```

## Configuring the Knative domain
By default, Knative will route service to the domain `example.com`
you can specify a different domain name by editing `config-domain.yaml` and
running
`kubectl apply --filename config-domain.yaml`
