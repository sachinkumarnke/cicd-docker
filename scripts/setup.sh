#!/bin/bash

# Setup script for CI/CD Docker App
set -e

echo "🚀 Setting up CI/CD Docker App environment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

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

print_header() {
    echo -e "${BLUE}[SETUP]${NC} $1"
}

# Check if running on WSL
if grep -q Microsoft /proc/version; then
    print_warning "Detected WSL environment"
    WSL_ENV=true
else
    WSL_ENV=false
fi

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check Node.js
print_header "Checking Node.js installation..."
if command_exists node; then
    NODE_VERSION=$(node --version)
    print_status "Node.js is installed: $NODE_VERSION"
    
    # Check if version is 18 or higher
    NODE_MAJOR=$(echo $NODE_VERSION | cut -d'.' -f1 | sed 's/v//')
    if [ "$NODE_MAJOR" -ge 18 ]; then
        print_status "Node.js version is compatible (>= 18)"
    else
        print_warning "Node.js version is older than 18. Consider upgrading."
    fi
else
    print_error "Node.js is not installed"
    echo "Please install Node.js 18+ from: https://nodejs.org/"
    echo "Or use Node Version Manager (nvm):"
    echo "  curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash"
    echo "  nvm install 18"
    echo "  nvm use 18"
fi

# Check npm
print_header "Checking npm..."
if command_exists npm; then
    NPM_VERSION=$(npm --version)
    print_status "npm is installed: $NPM_VERSION"
else
    print_error "npm is not installed (usually comes with Node.js)"
fi

# Check Docker
print_header "Checking Docker installation..."
if command_exists docker; then
    if docker info > /dev/null 2>&1; then
        DOCKER_VERSION=$(docker --version)
        print_status "Docker is installed and running: $DOCKER_VERSION"
    else
        print_error "Docker is installed but not running"
        if [ "$WSL_ENV" = true ]; then
            echo "For WSL, ensure Docker Desktop is running and WSL integration is enabled"
            echo "See: https://docs.docker.com/desktop/wsl/"
        else
            echo "Please start Docker daemon"
        fi
    fi
else
    print_error "Docker is not installed"
    echo "Please install Docker from: https://docs.docker.com/get-docker/"
fi

# Check Docker Compose
print_header "Checking Docker Compose..."
if command_exists docker-compose || docker compose version > /dev/null 2>&1; then
    print_status "Docker Compose is available"
else
    print_warning "Docker Compose not found (may be integrated with Docker)"
fi

# Check Git
print_header "Checking Git..."
if command_exists git; then
    GIT_VERSION=$(git --version)
    print_status "Git is installed: $GIT_VERSION"
else
    print_error "Git is not installed"
    echo "Please install Git from: https://git-scm.com/"
fi

# Optional tools
print_header "Checking optional tools..."

# Check kubectl
if command_exists kubectl; then
    KUBECTL_VERSION=$(kubectl version --client --short 2>/dev/null || kubectl version --client 2>/dev/null)
    print_status "kubectl is installed: $KUBECTL_VERSION"
else
    print_warning "kubectl is not installed (optional, for Kubernetes deployment)"
    echo "Install with: curl -LO \"https://dl.k8s.io/release/\$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl\" && sudo install kubectl /usr/local/bin/"
fi

# Check minikube
if command_exists minikube; then
    MINIKUBE_VERSION=$(minikube version --short 2>/dev/null || echo "installed")
    print_status "Minikube is installed: $MINIKUBE_VERSION"
else
    print_warning "Minikube is not installed (optional, for local Kubernetes)"
    echo "Install with: curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && sudo install minikube-linux-amd64 /usr/local/bin/minikube"
fi

echo ""
print_header "Setup Summary"
echo "✅ Required tools:"
echo "   - Node.js: $(command_exists node && echo "✓" || echo "✗")"
echo "   - npm: $(command_exists npm && echo "✓" || echo "✗")"
echo "   - Docker: $(command_exists docker && echo "✓" || echo "✗")"
echo "   - Git: $(command_exists git && echo "✓" || echo "✗")"
echo ""
echo "🔧 Optional tools:"
echo "   - kubectl: $(command_exists kubectl && echo "✓" || echo "✗")"
echo "   - minikube: $(command_exists minikube && echo "✓" || echo "✗")"

echo ""
print_header "Next Steps"
echo "1. Install any missing required tools"
echo "2. Run 'npm install' to install dependencies"
echo "3. Run 'npm test' to run tests"
echo "4. Run './scripts/deploy-local.sh' for Docker deployment"
echo "5. Run './scripts/deploy-minikube.sh' for Kubernetes deployment"

echo ""
print_status "🎉 Setup check completed!"
