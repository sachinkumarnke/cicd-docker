#!/bin/bash

# Local deployment script for CI/CD Docker App
set -e

echo "🚀 Starting local deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
IMAGE_NAME="cicd-docker-app"
CONTAINER_NAME="cicd-app-local"
PORT="3000"

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

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    print_error "Docker is not running. Please start Docker and try again."
    exit 1
fi

# Stop and remove existing container if it exists
if docker ps -a --format 'table {{.Names}}' | grep -q "^${CONTAINER_NAME}$"; then
    print_warning "Stopping existing container: ${CONTAINER_NAME}"
    docker stop ${CONTAINER_NAME} || true
    docker rm ${CONTAINER_NAME} || true
fi

# Build the Docker image
print_status "Building Docker image: ${IMAGE_NAME}"
docker build -t ${IMAGE_NAME}:latest .

# Run the container
print_status "Starting container: ${CONTAINER_NAME}"
docker run -d \
    --name ${CONTAINER_NAME} \
    -p ${PORT}:3000 \
    -e NODE_ENV=production \
    --restart unless-stopped \
    ${IMAGE_NAME}:latest

# Wait for the application to start
print_status "Waiting for application to start..."
sleep 5

# Health check
print_status "Performing health check..."
if curl -f http://localhost:${PORT}/health > /dev/null 2>&1; then
    print_status "✅ Application is running successfully!"
    echo ""
    echo "🔗 Application URL: http://localhost:${PORT}"
    echo "🏥 Health Check: http://localhost:${PORT}/health"
    echo "👥 API Endpoint: http://localhost:${PORT}/api/users"
    echo ""
    echo "📊 Container Status:"
    docker ps --filter "name=${CONTAINER_NAME}" --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"
else
    print_error "❌ Health check failed. Check container logs:"
    docker logs ${CONTAINER_NAME}
    exit 1
fi

echo ""
print_status "🎉 Local deployment completed successfully!"
