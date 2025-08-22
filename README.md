# CI/CD Pipeline with GitHub Actions & Docker

A complete CI/CD pipeline demonstration using GitHub Actions, Docker, and local deployment options (Docker Compose and Minikube).

## 🚀 Project Overview

This project demonstrates a full CI/CD pipeline that:
- Builds a Node.js application
- Runs automated tests
- Performs security scans
- Builds and pushes Docker images
- Deploys to local environments

## 📋 Prerequisites

- **Node.js** (v18 or higher)
- **Docker** and **Docker Compose**
- **Git**
- **Minikube** (optional, for Kubernetes deployment)
- **kubectl** (optional, for Kubernetes deployment)

## 🏗️ Project Structure

```
CiCd-docker/
├── .github/
│   └── workflows/
│       └── ci-cd.yml          # GitHub Actions workflow
├── scripts/
│   ├── deploy-local.sh        # Local Docker deployment
│   └── deploy-minikube.sh     # Minikube deployment
├── app.js                     # Main application
├── app.test.js               # Test suite
├── package.json              # Node.js dependencies
├── Dockerfile                # Docker image definition
├── docker-compose.yml        # Multi-container setup
├── nginx.conf               # Nginx configuration
└── README.md                # This file
```

## 🛠️ Local Development Setup

### 1. Install Dependencies

```bash
npm install
```

### 2. Run Tests

```bash
npm test
```

### 3. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## 🐳 Docker Deployment

### Option 1: Simple Docker Run

```bash
# Build the image
docker build -t cicd-docker-app .

# Run the container
docker run -p 3000:3000 cicd-docker-app
```

### Option 2: Docker Compose (Recommended)

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Option 3: Automated Local Deployment

```bash
./scripts/deploy-local.sh
```

## ☸️ Kubernetes Deployment (Minikube)

### Prerequisites
- Install Minikube: `curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64 && sudo install minikube-linux-amd64 /usr/local/bin/minikube`
- Install kubectl: `curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl" && sudo install kubectl /usr/local/bin/`

### Deploy to Minikube

```bash
./scripts/deploy-minikube.sh
```

This script will:
- Start Minikube if not running
- Build the Docker image in Minikube's Docker environment
- Deploy the application with 2 replicas
- Create services and ingress
- Provide access URLs

## 🔄 CI/CD Pipeline

### GitHub Actions Workflow

The pipeline includes the following stages:

1. **Test Stage**
   - Runs unit tests
   - Generates coverage reports
   - Uploads to Codecov

2. **Security Stage**
   - NPM audit for vulnerabilities
   - Snyk security scanning

3. **Build & Push Stage**
   - Builds multi-architecture Docker image
   - Pushes to Docker Hub
   - Runs Trivy vulnerability scan

4. **Deploy Stages**
   - Staging deployment
   - Production deployment (with manual approval)

### Required GitHub Secrets

Set these secrets in your GitHub repository:

```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
SNYK_TOKEN=your-snyk-token (optional)
```

### Workflow Triggers

- **Push to main**: Full pipeline with deployment
- **Push to develop**: Test and build only
- **Pull requests**: Test and security scan only

## 📊 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | Welcome message with app info |
| `/health` | GET | Health check endpoint |
| `/api/users` | GET | Sample API endpoint |

## 🧪 Testing

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm test -- --coverage
```

### Manual Testing
```bash
# Health check
curl http://localhost:3000/health

# API endpoint
curl http://localhost:3000/api/users

# Main endpoint
curl http://localhost:3000/
```

## 🔧 Configuration

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `NODE_ENV` | development | Application environment |
| `PORT` | 3000 | Server port |

### Docker Configuration

- **Base Image**: `node:18-alpine`
- **Working Directory**: `/usr/src/app`
- **Exposed Port**: `3000`
- **Health Check**: Enabled with `/health` endpoint

## 📈 Monitoring & Observability

### Health Checks
- **Docker**: Built-in health check using `/health` endpoint
- **Kubernetes**: Liveness and readiness probes configured

### Logging
- Application logs to stdout/stderr
- Docker logs: `docker logs <container-name>`
- Kubernetes logs: `kubectl logs -f deployment/cicd-app -n cicd-app`

## 🚨 Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Find process using port 3000
   lsof -i :3000
   # Kill the process
   kill -9 <PID>
   ```

2. **Docker build fails**
   ```bash
   # Clean Docker cache
   docker system prune -a
   ```

3. **Minikube issues**
   ```bash
   # Reset Minikube
   minikube delete && minikube start
   ```

### Logs and Debugging

```bash
# Application logs (Docker)
docker logs cicd-app-local

# Application logs (Kubernetes)
kubectl logs -f deployment/cicd-app -n cicd-app

# Container shell access
docker exec -it cicd-app-local sh
```

## 🔐 Security Best Practices

- ✅ Non-root user in Docker container
- ✅ Multi-stage Docker builds (can be added)
- ✅ Security scanning with Trivy and Snyk
- ✅ NPM audit for vulnerabilities
- ✅ Resource limits in Kubernetes
- ✅ Health checks and probes

## 📚 Additional Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Kubernetes Documentation](https://kubernetes.io/docs/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

---

## 🎯 Next Steps

1. **Set up GitHub repository** and push this code
2. **Configure Docker Hub** account and update image name in workflow
3. **Add GitHub secrets** for Docker Hub credentials
4. **Test the pipeline** by pushing to main branch
5. **Monitor deployments** and iterate on the pipeline

Happy coding! 🚀
# cicd-docker
