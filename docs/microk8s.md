# Install microK8s

To run `leashk8s` stack locally on microK8s you will need:
  - microK8s
  - add $USER to microK8s group
  - enable ingress
  - enable metallb
  - enable istio
  - enable knative
  - install kubeless from github yaml file

## Install microK8s

Latest instructions on installing microK8s here:

### linux https://microk8s.io/docs

#### Install snap on linux mint:
https://snapcraft.io/

On linux mint:
```
sudo rm /etc/apt/preferences.d/nosnap.pref
sudo apt update
sudo apt install snapd
```
Then add your $USER to the microK8s group

```
sudo usermod -a -G microk8s $USER
sudo chown -f -R $USER ~/.kube
```

You will also need to re-enter the session for the group update to take place:

`su - $USER`

** Note I had an issue where when i tried to add my user to the group,
i got a group does not exist error even though the group was created.
to solve this I was able to look up the groups with
`cat /etc/groups` and take the microK8s group numeric id and run that
 `sudo usermod -a -G $mk8s-grp-id $USER`



If you would like to be able to teardown/rebuild your microK8s cluster from scratch
https://microk8s.io/docs/install-alternatives#heading--offline

`snap download microk8s`



MacOs https://microk8s.io/docs/install-alternatives#heading--macos

## Enabling microK8s addons

For networking enable dns, ingress, and metallb

`microk8s enable dns ingress`

To enable LoadBalancer service types

`microK8s enable metallb`

This will prompt you for an IP range, you can use something like
`10.96.246.112/24`

## Enable knative

Istio will also be enabled along with knative
(to run native with gloo, you would have to install following instructions
in minikube.md)

`microk8s enable knative`

## Add microK8s to kubectl config
microK8s will not add itself to your kubectl contexts. You can either use
the microK8s.kubectl CLI to run kubectl commands. 

To use microK8s with your kubectl command, manually get your

`microK8s config`

copy that info, then open up `$HOME/.kube/config` in a text editor, and then
paste the -cluster, -context, and -user properties into the respective -clusters, -contexts, and -users parameters in your kube config.
