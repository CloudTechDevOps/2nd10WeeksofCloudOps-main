#-------------------ArgoCD----------------
kubectl create namespace argocd
kubectl apply -n argocd -f https://raw.githubusercontent.com/argoproj/argo-cd/stable/manifests/install.yaml

#----------------Grafana Prometheus-------------------
helm repo add stable https://charts.helm.sh/stable
helm repo add prometheus-community https://prometheus-community.github.io/helm-charts
kubectl create namespace Prometheus
helm install stable prometheus-community/kube-prometheus-stack -n prometheus


#----------------EBS CSI Driver for Kubernetes volumes 
helm repo add aws-ebs-csi-driver https://kubernetes-sigs.github.io/aws-ebs-csi-driver
helm repo update

#install aws ebs driver to kubernets 
helm upgrade --install aws-ebs-csi-driver --namespace kube-system aws-ebs-csi-driver/aws-ebs-csi-driver
