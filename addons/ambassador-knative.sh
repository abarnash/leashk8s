kubectl apply --filename https://github.com/knative/serving/releases/download/v0.18.0/serving-crds.yaml
kubectl apply --filename https://github.com/knative/serving/releases/download/v0.18.0/serving-core.yaml
kubectl create namespace ambassador
kubectl apply --namespace ambassador \
  --filename https://getambassador.io/yaml/ambassador/ambassador-crds.yaml \
  --filename https://getambassador.io/yaml/ambassador/ambassador-rbac.yaml \
  --filename https://getambassador.io/yaml/ambassador/ambassador-service.yaml
kubectl patch clusterrolebinding ambassador -p '{"subjects":[{"kind": "ServiceAccount", "name": "ambassador", "namespace": "ambassador"}]}'
kubectl set env --namespace ambassador  deployments/ambassador AMBASSADOR_KNATIVE_SUPPORT=true
kubectl patch configmap/config-network \
  --namespace knative-serving \
  --type merge \
  --patch '{"data":{"ingress.class":"ambassador.ingress.networking.knative.dev"}}'
kubectl --namespace ambassador get service ambassador
kubectl apply --filename ../config-domain.yaml
