# Use Pulumi w/ Docker

## Get Pulumi credentials
Create a file in your project dir to store your credentials:
`touch .env`

Sign into to your pulumi account, go to Settings and then Access Tokens.
Create a new access token and add this line to your `.env` file
`PULUMI_ACCESS_TOKEN=paste_token_here`

## Launch the pulumi docker container

Pull the pulumi docker image
`docker pull pulumi/pulumi`

(*note* do not put strings around your token in the .env file)

Then start a pulumi container and a bash shell:
```
docker-compose run --name pstack --entrypoint /bin/bash cloudleash --name pulumi-gcp
```

## Get k8s cluster credentials

Once in the bash, authorize your gcp account:
```sh
gcloud config set project perfect-analog-256413 && \
gcloud config set compute/zone us-east4-c && \
gcloud container clusters get-credentials leash-dev
```

## Launch your Pulumi stack

CD into the project directory
`cd stack`

To create your stack:
`pulumi up`

Select `create new stack` when prompted.
Select a name for your stack, this will also be the namespace of all your resources in the cluster.

To see the resources your stack created:
`kubectl get all -n your-stack-name`
