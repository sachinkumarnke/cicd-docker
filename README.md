# CI/CD Pipeline with GitHub Actions & Docker

A complete CI/CD pipeline demonstration using GitHub Actions, Docker, and local deployment options with enhanced API functionality and comprehensive testing.

## 🚀 Project Overview

This project demonstrates a full CI/CD pipeline that:
- Builds a Node.js application with comprehensive REST API
- Runs automated tests with extensive coverage
- Performs security scans and vulnerability assessments
- Builds optimized multi-stage Docker images
- Deploys to local environments with health checks
- Includes comprehensive API testing and monitoring

## ✨ What's New in v1.0.1

### Enhanced API Features
- **Comprehensive REST API** with CRUD operations
- **Advanced filtering** and pagination for users endpoint
- **Proper error handling** with structured JSON responses
- **Request logging** and monitoring capabilities
- **CORS support** for cross-origin requests
- **Input validation** and duplicate prevention

### Improved Docker Setup
- **Multi-stage builds** for optimized production images
- **Enhanced security** with non-root user and proper signal handling
- **Better health checks** with detailed status information
- **Resource limits** and restart policies
- **Comprehensive logging** and monitoring

### Advanced CI/CD Pipeline
- **Enhanced testing** with coverage reporting and quality checks
- **Security scanning** with Trivy and Snyk integration
- **SBOM generation** for supply chain security
- **Multi-environment deployments** with proper staging
- **Manual deployment triggers** and environment controls

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **Git**
- **curl** (for testing endpoints)
- **Minikube** (optional, for Kubernetes deployment)
- **kubectl** (optional, for Kubernetes deployment)

## 🏗️ Project Structure

```
CiCd-docker/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # Enhanced GitHub Actions workflow
├── scripts/
│   ├── deploy-local.sh        # Enhanced local Docker deployment
│   ├── deploy-minikube.sh     # Minikube deployment
│   ├── test-endpoints.sh      # Comprehensive API testing
│   └── setup.sh              # Environment setup
├── app.js                     # Enhanced main application
├── app.test.js               # Comprehensive test suite
├── package.json              # Enhanced dependencies and scripts
├── Dockerfile                # Multi-stage optimized Docker build
├── docker-compose.yml        # Enhanced multi-container setup
├── nginx.conf               # Advanced Nginx configuration
└── README.md                # This file
```

## 🛠️ Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🐳 Docker Deployment

### Option 1: Quick Start with Enhanced Script

```bash
./scripts/deploy-local.sh
```

This script will:
- Build the optimized Docker image
- Run comprehensive health checks
- Test all API endpoints
- Provide detailed deployment information

### Option 2: Docker Compose (Recommended for Production-like Setup)

```bash
# Start all services with enhanced configuration
docker-compose up -d

# View logs with timestamps
docker-compose logs -f

# Stop all services
docker-compose down
```

### Option 3: Manual Docker Commands

```bash
# Build the multi-stage image
docker build -t cicd-docker-app:latest .

# Run with enhanced configuration
docker run -d \
  --name cicd-app-local \
  -p 3000:3000 \
  -e NODE_ENV=production \
  --restart unless-stopped \
  cicd-docker-app:latest
```

## ☸️ Kubernetes Deployment (Minikube)

### Prerequisites
- Install Minikube: `curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && sudo install minikube-linux-amd64 /usr/local/bin/minikube`
- Install kubectl: `curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && sudo install kubectl /usr/local/bin/`

### Deploy to Minikube

```bash
./scripts/deploy-minikube.sh
```

## 🔄 Enhanced CI/CD Pipeline

### GitHub Actions Workflow Features

The pipeline includes the following enhanced stages:

1. **Test & Quality Stage**
   - Comprehensive unit and integration tests
   - Code coverage reporting with Codecov
   - Quality checks and linting

2. **Security Stage**
   - NPM audit for vulnerabilities
   - Snyk security scanning with SARIF upload
   - Dependency vulnerability assessment

3. **Build & Push Stage**
   - Multi-stage Docker builds for optimization
   - Multi-architecture support (AMD64/ARM64)
   - Trivy vulnerability scanning
   - SBOM (Software Bill of Materials) generation
   - Docker layer caching for faster builds

4. **Deploy Stages**
   - Staging deployment with smoke tests
   - Production deployment with manual approval
   - Integration testing and health checks
   - Rollback capabilities

### Required GitHub Secrets

Set these secrets in your GitHub repository:

```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
SNYK_TOKEN=your-snyk-token (optional)
```

### Workflow Triggers

- **Push to main**: Full pipeline with staging and production deployment
- **Push to develop**: Test, security scan, and build only
- **Pull requests**: Test and security scan only
- **Manual dispatch**: Deploy to specific environment

## 📊 Enhanced API Endpoints

| Endpoint | Method | Description | Query Parameters |
|----------|--------|-------------|------------------|
| `/` | GET | Welcome message with app info | - |
| `/health` | GET | Comprehensive health check | - |
| `/api` | GET | API documentation | - |
| `/api/users` | GET | Get all users | `role`, `limit` |
| `/api/users/:id` | GET | Get user by ID | - |
| `/api/users` | POST | Create new user | - |

### API Response Format

All API responses follow a consistent format:

```json
{
  "success": true,
  "data": {...},
  "count": 3,
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

### Error Response Format

```json
{
  "success": false,
  "error": "Error description",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## 🧪 Comprehensive Testing

### Automated Test Suite

```bash
# Run all tests with coverage
npm run test:coverage

# Run specific test categories
npm test -- --testNamePattern="health"
npm test -- --testNamePattern="users"
```

### API Endpoint Testing

```bash
# Test all endpoints comprehensively
./scripts/test-endpoints.sh

# Test against different environment
./scripts/test-endpoints.sh http://staging.example.com
```

### Manual Testing Examples

```bash
# Health check with detailed information
curl http://localhost:3000/health | jq

# Get all users with filtering
curl "http://localhost:3000/api/users?role=admin&limit=2" | jq

# Create a new user
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","role":"user"}' | jq

# Get specific user
curl http://localhost:3000/api/users/1 | jq
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Application environment |
| `PORT` | 3000 | Server port |

### Docker Configuration

- **Base Image**: `node:18-alpine` (multi-stage build)
- **Working Directory**: `/usr/src/app`
- **Exposed Port**: `3000`
- **Health Check**: Enhanced with JSON response validation
- **Security**: Non-root user, dumb-init for signal handling

### Nginx Configuration

- **Load balancing** with upstream configuration
- **Rate limiting** for API endpoints
- **Security headers** and CORS handling
- **Gzip compression** for better performance
- **Request logging** with detailed metrics

## 📈 Monitoring & Observability

### Health Checks
- **Docker**: Enhanced health check with JSON validation
- **Kubernetes**: Liveness and readiness probes
- **Application**: Detailed health endpoint with system metrics

### Logging
- **Structured logging** with timestamps and request IDs
- **Request/response logging** for all API calls
- **Error tracking** with stack traces
- **Performance metrics** and response times

### Metrics Available
- Application uptime and memory usage
- Request counts and response times
- Error rates and status code distribution
- Health check status and availability

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find and kill process using port 3000
   lsof -i :3000
   kill -9 <PID>
   ```

2. **Docker permission denied**
   ```bash
   # Add user to docker group
   sudo usermod -aG docker $USER
   newgrp docker
   ```

3. **API endpoints not working**
   ```bash
   # Check application logs
   docker logs -f cicd-app-local
   
   # Test endpoints manually
   ./scripts/test-endpoints.sh
   ```

4. **Docker build fails**
   ```bash
   # Clean Docker cache and rebuild
   docker system prune -a
   docker build --no-cache -t cicd-docker-app:latest .
   ```

### Debugging Commands

```bash
# Application logs (Docker)
docker logs -f cicd-app-local

# Application logs (Kubernetes)
kubectl logs -f deployment/cicd-app -n cicd-app

# Container shell access
docker exec -it cicd-app-local sh

# Check container health
docker inspect cicd-app-local | jq '.[0].State.Health'

# Monitor resource usage
docker stats cicd-app-local
```

## 🔐 Security Best Practices

- ✅ **Multi-stage Docker builds** for minimal attack surface
- ✅ **Non-root user** in Docker container
- ✅ **Security scanning** with Trivy and Snyk
- ✅ **NPM audit** for vulnerability detection
- ✅ **SBOM generation** for supply chain security
- ✅ **Resource limits** in Kubernetes and Docker Compose
- ✅ **Health checks** and proper signal handling
- ✅ **Input validation** and sanitization
- ✅ **Rate limiting** and CORS configuration
- ✅ **Security headers** in Nginx configuration

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [Express.js Security Best Practices](https://expressjs.com/en/advanced/best-practice-security.html)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Make your changes and add tests
4. Ensure all tests pass (`npm test`)
5. Run the linting checks
6. Test the Docker build (`./scripts/deploy-local.sh`)
7. Commit your changes (`git commit -m 'Add amazing feature'`)
8. Push to the branch (`git push origin feature/amazing-feature`)
9. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Next Steps

1. **Set up GitHub repository** and push this enhanced code
2. **Configure Docker Hub** account and update image name in workflow
3. **Add GitHub secrets** for Docker Hub and Snyk credentials
4. **Test the enhanced pipeline** by pushing to main branch
5. **Monitor deployments** and iterate on the pipeline
6. **Set up monitoring** and alerting for production deployments

## 🚀 Quick Start Commands

```bash
# Clone and setup
git clone <your-repo-url>
cd CiCd-docker
npm install

# Run tests
npm test

# Deploy locally
./scripts/deploy-local.sh

# Test all endpoints
./scripts/test-endpoints.sh

# Deploy with Docker Compose
docker-compose up -d
```

Happy coding! 🚀

---

**Version**: 1.0.1  
**Last Updated**: August 2024  
**Maintainer**: DevOps Team
