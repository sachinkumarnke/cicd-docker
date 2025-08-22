#!/bin/bash

# Test script for CI/CD Docker App
set -e

echo "🧪 Testing CI/CD Docker App..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[TEST]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
BASE_URL="http://localhost:3000"
TIMEOUT=30

# Function to wait for service
wait_for_service() {
    local url=$1
    local timeout=$2
    local count=0
    
    print_status "Waiting for service at $url..."
    
    while [ $count -lt $timeout ]; do
        if curl -f -s "$url/health" > /dev/null 2>&1; then
            print_status "✅ Service is ready!"
            return 0
        fi
        sleep 1
        count=$((count + 1))
        echo -n "."
    done
    
    print_error "❌ Service failed to start within $timeout seconds"
    return 1
}

# Function to test endpoint
test_endpoint() {
    local endpoint=$1
    local expected_status=$2
    local description=$3
    
    print_status "Testing $description: $endpoint"
    
    response=$(curl -s -w "%{http_code}" "$endpoint" -o /tmp/response.json)
    status_code="${response: -3}"
    
    if [ "$status_code" = "$expected_status" ]; then
        print_status "✅ $description: HTTP $status_code (Expected: $expected_status)"
        if [ -f /tmp/response.json ]; then
            echo "   Response: $(cat /tmp/response.json | head -c 100)..."
        fi
    else
        print_error "❌ $description: HTTP $status_code (Expected: $expected_status)"
        if [ -f /tmp/response.json ]; then
            echo "   Response: $(cat /tmp/response.json)"
        fi
        return 1
    fi
}

# Main test function
run_tests() {
    print_status "🚀 Starting application tests..."
    
    # Wait for service to be ready
    if ! wait_for_service "$BASE_URL" $TIMEOUT; then
        print_error "Service is not available. Make sure the application is running."
        echo "Start the application with one of these commands:"
        echo "  npm start"
        echo "  docker run -p 3000:3000 cicd-docker-app"
        echo "  docker-compose up -d"
        echo "  ./scripts/deploy-local.sh"
        exit 1
    fi
    
    echo ""
    print_status "🧪 Running endpoint tests..."
    
    # Test main endpoint
    test_endpoint "$BASE_URL/" "200" "Main endpoint"
    
    # Test health endpoint
    test_endpoint "$BASE_URL/health" "200" "Health check endpoint"
    
    # Test API endpoint
    test_endpoint "$BASE_URL/api/users" "200" "Users API endpoint"
    
    # Test 404 endpoint
    test_endpoint "$BASE_URL/nonexistent" "404" "404 error handling"
    
    echo ""
    print_status "✅ All tests passed successfully!"
    
    echo ""
    print_status "📊 Application Information:"
    echo "🔗 Main URL: $BASE_URL"
    echo "🏥 Health Check: $BASE_URL/health"
    echo "👥 Users API: $BASE_URL/api/users"
}

# Check if curl is available
if ! command -v curl > /dev/null 2>&1; then
    print_error "curl is not installed. Please install curl to run tests."
    exit 1
fi

# Run tests
run_tests

echo ""
print_status "🎉 Testing completed successfully!"
