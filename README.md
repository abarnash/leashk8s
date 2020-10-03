# Leash K8s

A repository for managing cloud applications on Kubernetes with
Pulumi.

## Install a Kubernetes development environment in GKE (recommended)

To run this stack in a Google Cloud GKE cluster see instructions

- [Google Cloud Setup Instructions](docs/gke.md)

## Install a local Kubernetes development environment

To run this stack locally, you can install k8s with something like microK8s (runs natively), minikube (runs in a VM) or kind (runs in docker).

- [microK8s Installation Instructions](docs/microk8s.md)
- [Minikube Installation Instructions](docs/minikube.md)

## Install Pulumi
To deploy this stack to your Kubernetes cluster you will need a Pulumi developer
account and the CLI tool installed.
Instructions here:

https://www.pulumi.com/docs/get-started/install/

## Run the main dev stack

`pulumi up`

When prompted `create new stack` hit enter, and provide a name for your stack.

## Get your stack's namespace
The stack will create a unique namespace for your stack. You can find this by running:

`kubectl get ns`

It will be the namespace with the prefix `leashk8s-dev-` followed by a unique identifier.

For convenience you can copy that to an env variable:

`export KNS=<<paste ns here>>`

### Knative container services

To get a list of your knative services available:

`kubectl get services -n $KNS`

You should see a list of services and the URL that the Contour gateway will use to route traffic to that service.

To test the services locally, you'll need to get the IP address of your contour gateway by running:

`kubectl --namespace contour-external get service envoy`

Add an env variable in your console for that IP address:

`export ENVOY_IP=<<paste your external ip here>>`

Once you've done that you can test the services with the following examples:

  - helloworld-go
    ```
    curl -H "Host: helloworld-go.$KNS.cloudleash.org" $ENVOY_IP
    ```
  - helloworld-clj
    ```
    curl -H "Host: helloworld-clj.$KNS.cloudleash.org" $ENVOY_IP
    ```
  - helloworld-ruby
    ```
    curl -H "Host: helloworld-ruby.$KNS.cloudleash.org" $ENVOY_IP
    ```

To run the WebSockets example app, you'll need to add the envoy ip to your `/etc/hosts` file.
Open your `/etc/hosts` file and add a line:

`<<paste your envoy ip>> node-ws.<<paste your namespace here>>.cloudleash.org`

If you navigate to a browser with the url above, you should see the WebSocket React App

## The Pulumi Stack

The main stack that `pulumi up` will provision is defined:
[stacks/index.js](stacks/index.js)

The stack defines four Knative services, for example the `node-ws` Knative service that provides a serverless websocket application.

```
const wsNodeSvc = knative.service({
  name: 'node-ws',
  namespace: NAMESPACE_LABEL,
  image: 'docker.io/abarnash/node-ws',
  scale: {
    max: 1
  },
  env: {
    TARGET: 'Leash'
  }
})
```

The `image` property is linked to a docker hub image, called `docker.io/abarnash/node-ws`, but you can edit this to any valid hosted docker image.

The `abarnash/node-ws` image for this application is located in `containers/node-ws`. The `containers/node-ws/index.js` is the backend application that handles websocket connections. The `frontend` directory holds the client React chat application.

To test locally you must first build the frontend application by going to `containers/node-ws/frontend` dir and running `yarn build`.

To the backend service in your console by navigating into the
`containers/node-ws` dir and running `npm run start`
In a browser, navigate to `localhost:8080` and you should see the chat app. Launch a second browser window to send messages between the two instances.

To make changes and deploy to your cluster:

`docker build -t <org-name>/node-ws .`

followed by

`dockr push <org-name>/node-ws`

Then update the `image` propert in your `stacks/index.js` file to point to your new image.

You can also test the docker image locally with:
`docker run -p 8080:8080 abarnash/node-ws`
