kubectl apply --filename https://github.com/knative/serving/releases/download/v0.18.0/serving-crds.yaml

kubectl apply --filename https://github.com/knative/serving/releases/download/v0.18.0/serving-core.yaml


kubectl apply --filename https://github.com/knative/net-contour/releases/download/v0.18.0/contour.yaml

kubectl apply --filename https://github.com/knative/net-contour/releases/download/v0.18.0/net-contour.yaml

kubectl patch configmap/config-network \
  --namespace knative-serving \
  --type merge \
  --patch '{"data":{"ingress.class":"contour.ingress.networking.knative.dev"}}'
