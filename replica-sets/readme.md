kubectl get pods --watch
kubectl get rs --watch
kubectl describe $(kubectl get pods -o=name) | grep Image
