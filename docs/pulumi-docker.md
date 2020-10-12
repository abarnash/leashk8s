# Use Pulumi w/ Docker

## Get Pulumi credentials
Create a file in your project dir to store your credentials:
`touch .env`

Sign into to your pulumi account, go to Settings and then Access Tokens.
Create a new access token and add this line to your `.env` file
```sh
PULUMI_ACCESS_TOKEN=paste_token_here
```

Also paste your google cloud information here if you want to automatically load the env variables for later commands:
```sh
GCP_PROJECT_NAME=perfect-analog-256413
GCP_COMPUTE_REGION=us-east4-c
GKE_CLUSTER_NAME=leash-dev
```

(*note* do not put strings around your values in the .env file)

## Launch the pulumi docker container

Pull the pulumi docker image
```sh
docker pull pulumi/pulumi
```


Then start a pulumi container and a bash shell:
```sh
docker-compose run --name pstack --entrypoint /bin/bash leashk8s
```

## Get k8s cluster credentials

Once in the bash, authorize your gcp account:
```sh
gcloud auth login
```

This will give you a url to authorize via web browser. Paste the token granted into the shell.

Next you can fetch the kubernetes credentials for the cluster:
```sh
gcloud config set project $GCP_PROJECT_NAME && \
gcloud config set compute/zone $GCP_COMPUTE_REGION && \
gcloud container clusters get-credentials $GKE_CLUSTER_NAME
```

Test the configuration worked:
```sh
gcloud compute instances list
```

## Launch your Pulumi stack

CD into the project directory, install dependencies, and add helm repos:
```sh
cd stack && \
helm repo add bitnami https://charts.bitnami.com/bitnami && \
npm i
```

To create your stack:
```sh
pulumi up
```

Select `create new stack` when prompted.
Select a name for your stack, this will also be the namespace of all your resources in the cluster.

To see the resources your stack created:
```sh
kubectl get all -n your-stack-name
```
