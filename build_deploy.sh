#!/usr/bin/env bash
set -e

echo "🛠  Building images…"
docker build -t backend:latest ./api
docker build -t frontend:latest ./client

# If you are on kind or k3d you must load the images into the cluster nodes
# Comment these two lines out when you’re using Docker Desktop’s built-in cluster
kind load docker-image backend:latest || true
kind load docker-image frontend:latest || true

echo "🚢  Applying manifests…"
kubectl apply -f k8s/

echo "✅  Done. Watch with: kubectl get pods -w"
# App URLs (update ports if they change in your Service YAMLs)
echo "🌐  Frontend : http://localhost:31794
echo "🛠  Backend : http://localhost:30813

