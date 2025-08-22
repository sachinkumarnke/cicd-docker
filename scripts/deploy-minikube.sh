#!/bin/bash

# Minikube deployment script for CI/CD Docker App
set -e

echo "🚀 Starting Minikube deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="cicd-docker-app"
NAMESPACE="cicd-app"

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Minikube is running
if ! minikube status > /dev/null 2>&1; then
    print_warning "Minikube is not running. Starting Minikube..."
    minikube start
fi

# Set Docker environment to use Minikube's Docker daemon
print_status "Setting Docker environment to Minikube..."
eval $(minikube docker-env)

# Build the Docker image in Minikube
print_status "Building Docker image in Minikube: ${IMAGE_NAME}"
docker build -t ${IMAGE_NAME}:latest .

# Create namespace if it doesn't exist
print_status "Creating namespace: ${NAMESPACE}"
kubectl create namespace ${NAMESPACE} --dry-run=client -o yaml | kubectl apply -f -

# Create Kubernetes manifests directory
mkdir -p k8s

# Create deployment manifest
cat > k8s/deployment.yaml << EOF
apiVersion: apps/v1
kind: Deployment
metadata:
  name: cicd-app
  namespace: ${NAMESPACE}
  labels:
    app: cicd-app
spec:
  replicas: 2
  selector:
    matchLabels:
      app: cicd-app
  template:
    metadata:
      labels:
        app: cicd-app
    spec:
      containers:
      - name: app
        image: ${IMAGE_NAME}:latest
        imagePullPolicy: Never
        ports:
        - containerPort: 3000
        env:
        - name: NODE_ENV
          value: "production"
        - name: PORT
          value: "3000"
        livenessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 30
          periodSeconds: 10
        readinessProbe:
          httpGet:
            path: /health
            port: 3000
          initialDelaySeconds: 5
          periodSeconds: 5
        resources:
          requests:
            memory: "128Mi"
            cpu: "100m"
          limits:
            memory: "256Mi"
            cpu: "200m"
---
apiVersion: v1
kind: Service
metadata:
  name: cicd-app-service
  namespace: ${NAMESPACE}
spec:
  selector:
    app: cicd-app
  ports:
  - port: 80
    targetPort: 3000
    protocol: TCP
  type: ClusterIP
---
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: cicd-app-ingress
  namespace: ${NAMESPACE}
  annotations:
    nginx.ingress.kubernetes.io/rewrite-target: /
spec:
  rules:
  - host: cicd-app.local
    http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: cicd-app-service
            port:
              number: 80
EOF

# Apply Kubernetes manifests
print_status "Applying Kubernetes manifests..."
kubectl apply -f k8s/deployment.yaml

# Wait for deployment to be ready
print_status "Waiting for deployment to be ready..."
kubectl wait --for=condition=available --timeout=300s deployment/cicd-app -n ${NAMESPACE}

# Get service URL
print_status "Getting service URL..."
SERVICE_URL=$(minikube service cicd-app-service --url -n ${NAMESPACE})

# Display deployment information
print_status "✅ Minikube deployment completed successfully!"
echo ""
echo "🔗 Service URL: ${SERVICE_URL}"
echo "🏥 Health Check: ${SERVICE_URL}/health"
echo "👥 API Endpoint: ${SERVICE_URL}/api/users"
echo ""
echo "📊 Pod Status:"
kubectl get pods -n ${NAMESPACE} -l app=cicd-app
echo ""
echo "🌐 Service Status:"
kubectl get services -n ${NAMESPACE}

# Add host entry instruction
echo ""
print_warning "To access via ingress (cicd-app.local), add this to your /etc/hosts:"
echo "$(minikube ip) cicd-app.local"

echo ""
print_status "🎉 Minikube deployment completed successfully!"
print_status "Run 'minikube service cicd-app-service -n ${NAMESPACE}' to open in browser"
