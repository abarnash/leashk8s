# Leash K8s

A repository for managing cloud applications on Kubernetes with
Pulumi.

## Environment Setup

### Pulumi w/ Docker
Follow these instructions to deploy the stack to a GKE cluster using the docker `pulumi` image. With this option you won't need to install anything to your local machine other than docker.
- [Pulumi + Docker Instructions](docs/pulumi-docker.md)

### Other environments
To install pulumi locally and deploy to k8s clusters other than GKE, see this doc to get started.
- [Other Options](docs/installation.md)

## Run the main dev stack

`pulumi up`

When prompted `create new stack` hit enter, and provide a name for your stack. This name will be your namespace in the k8s cluster.

## Get your stack's namespace
The stack will create your unique namespace for your stack here:

```js
const ns = new k8s.core.v1.Namespace('leashk8s-dev', {
  metadata: {
    name: process.env.PULUMI_NODEJS_STACK
  }
})
```

You can get a list of all namespaces:

`kubectl get ns`

and create an alias with:

`export KNS=leashk8s-dev`



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
    ```sh
    curl -H "Host: helloworld-go.$KNS.cloudleash.org" $ENVOY_IP
    ```
  - helloworld-clj
    ```sh
    curl -H "Host: helloworld-clj.$KNS.cloudleash.org" $ENVOY_IP
    ```
  - helloworld-ruby
    ```sh
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

```js
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
