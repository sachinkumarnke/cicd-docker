#!/bin/bash

# Enhanced Local Deployment Script for CI/CD Docker App
# This script builds and deploys the application locally with comprehensive testing

set -euo pipefail  # Exit on error, undefined vars, pipe failures

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Configuration
APP_NAME="cicd-docker-app"
CONTAINER_NAME="cicd-app-local"
IMAGE_TAG="latest"
PORT=3000
HEALTH_ENDPOINT="http://localhost:${PORT}/health"
API_ENDPOINT="http://localhost:${PORT}/api/users"

# Functions
log_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

log_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

log_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

log_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

cleanup() {
    log_info "Cleaning up existing containers and images..."
    
    # Stop and remove existing container
    if docker ps -q -f name=${CONTAINER_NAME} | grep -q .; then
        log_info "Stopping existing container: ${CONTAINER_NAME}"
        docker stop ${CONTAINER_NAME} || true
    fi
    
    if docker ps -aq -f name=${CONTAINER_NAME} | grep -q .; then
        log_info "Removing existing container: ${CONTAINER_NAME}"
        docker rm ${CONTAINER_NAME} || true
    fi
}

build_image() {
    log_info "Building Docker image: ${APP_NAME}:${IMAGE_TAG}"
    
    if ! docker build -t ${APP_NAME}:${IMAGE_TAG} .; then
        log_error "Failed to build Docker image"
        exit 1
    fi
    
    log_success "Docker image built successfully"
}

run_container() {
    log_info "Starting container: ${CONTAINER_NAME}"
    
    docker run -d \
        --name ${CONTAINER_NAME} \
        -p ${PORT}:${PORT} \
        -e NODE_ENV=production \
        --restart unless-stopped \
        ${APP_NAME}:${IMAGE_TAG}
    
    if [ $? -eq 0 ]; then
        log_success "Container started successfully"
    else
        log_error "Failed to start container"
        exit 1
    fi
}

wait_for_health() {
    log_info "Waiting for application to be healthy..."
    
    local max_attempts=30
    local attempt=1
    
    while [ $attempt -le $max_attempts ]; do
        if curl -f -s ${HEALTH_ENDPOINT} > /dev/null 2>&1; then
            log_success "Application is healthy!"
            return 0
        fi
        
        log_info "Attempt ${attempt}/${max_attempts}: Waiting for health check..."
        sleep 2
        ((attempt++))
    done
    
    log_error "Application failed to become healthy within timeout"
    docker logs ${CONTAINER_NAME}
    return 1
}

run_tests() {
    log_info "Running application tests..."
    
    # Test health endpoint
    log_info "Testing health endpoint..."
    local health_response=$(curl -s ${HEALTH_ENDPOINT})
    if echo "$health_response" | grep -q '"status":"healthy"'; then
        log_success "Health endpoint test passed"
    else
        log_error "Health endpoint test failed"
        echo "Response: $health_response"
        return 1
    fi
    
    # Test API endpoint
    log_info "Testing API endpoint..."
    local api_response=$(curl -s ${API_ENDPOINT})
    if echo "$api_response" | grep -q '"success":true'; then
        log_success "API endpoint test passed"
    else
        log_error "API endpoint test failed"
        echo "Response: $api_response"
        return 1
    fi
    
    # Test creating a user
    log_info "Testing user creation..."
    local create_response=$(curl -s -X POST \
        -H "Content-Type: application/json" \
        -d '{"name":"Test User","email":"test@example.com","role":"user"}' \
        ${API_ENDPOINT})
    
    if echo "$create_response" | grep -q '"success":true'; then
        log_success "User creation test passed"
    else
        log_error "User creation test failed"
        echo "Response: $create_response"
        return 1
    fi
    
    log_success "All tests passed!"
}

show_info() {
    log_success "Deployment completed successfully!"
    echo ""
    echo "🚀 Application Information:"
    echo "   • Container Name: ${CONTAINER_NAME}"
    echo "   • Image: ${APP_NAME}:${IMAGE_TAG}"
    echo "   • Port: ${PORT}"
    echo ""
    echo "🔗 Access URLs:"
    echo "   • Main App: http://localhost:${PORT}"
    echo "   • Health Check: ${HEALTH_ENDPOINT}"
    echo "   • API Users: ${API_ENDPOINT}"
    echo "   • API Docs: http://localhost:${PORT}/api"
    echo ""
    echo "📊 Useful Commands:"
    echo "   • View logs: docker logs -f ${CONTAINER_NAME}"
    echo "   • Stop app: docker stop ${CONTAINER_NAME}"
    echo "   • Remove app: docker rm ${CONTAINER_NAME}"
    echo "   • Shell access: docker exec -it ${CONTAINER_NAME} sh"
    echo ""
}

main() {
    log_info "Starting local deployment of ${APP_NAME}..."
    
    # Check if Docker is running
    if ! docker info > /dev/null 2>&1; then
        log_error "Docker is not running. Please start Docker and try again."
        exit 1
    fi
    
    # Check if port is available
    if lsof -Pi :${PORT} -sTCP:LISTEN -t >/dev/null 2>&1; then
        log_warning "Port ${PORT} is already in use. Attempting to stop existing container..."
    fi
    
    # Deployment steps
    cleanup
    build_image
    run_container
    
    if wait_for_health; then
        run_tests
        show_info
    else
        log_error "Deployment failed - application is not healthy"
        log_info "Container logs:"
        docker logs ${CONTAINER_NAME}
        exit 1
    fi
}

# Handle script interruption
trap 'log_warning "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"
