#!/usr/bin/env bash
set -e

echo "🛠  Building images…"
docker build -t backend:latest ./api
docker build -t frontend:latest ./client

echo "🚢  Applying manifests…"
kubectl apply -f k8s/

echo "✅  Done. Watch with: kubectl get pods -w"
# App URLs (update ports if they change in your Service YAMLs)
echo "🌐  Frontend : http://localhost:31794
echo "🛠  Backend : http://localhost:30813

