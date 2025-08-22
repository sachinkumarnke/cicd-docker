# 🚀 CI/CD Pipeline Setup Guide

## 📋 Project Status

Your CI/CD pipeline project has been successfully created with the following structure:

```
CiCd-docker/
├── .github/workflows/ci-cd.yml    ✅ GitHub Actions workflow
├── scripts/
│   ├── setup.sh                   ✅ Environment setup script
│   ├── deploy-local.sh            ✅ Local Docker deployment
│   └── deploy-minikube.sh         ✅ Minikube deployment
├── app.js                         ✅ Node.js Express application
├── app.test.js                    ✅ Jest test suite
├── package.json                   ✅ Dependencies and scripts
├── jest.config.js                 ✅ Test configuration
├── Dockerfile                     ✅ Multi-stage Docker build
├── docker-compose.yml             ✅ Multi-container setup
├── nginx.conf                     ✅ Reverse proxy config
├── .dockerignore                  ✅ Docker ignore rules
├── .gitignore                     ✅ Git ignore rules
└── README.md                      ✅ Comprehensive documentation
```

## 🛠️ Prerequisites Setup

### 1. Check Current Environment
```bash
./scripts/setup.sh
```

This script will check for all required and optional tools.

### 2. Install Missing Tools

#### Node.js (Required)
```bash
# Using Node Version Manager (recommended)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Or download from nodejs.org
# https://nodejs.org/en/download/
```

#### Docker (Required)
```bash
# For Ubuntu/Debian
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER

# For WSL2, install Docker Desktop for Windows
# https://docs.docker.com/desktop/wsl/
```

#### kubectl (Optional - for Kubernetes)
```bash
curl -LO "https://dl.k8s.io/release/$(curl -L -s https://dl.k8s.io/release/stable.txt)/bin/linux/amd64/kubectl"
sudo install kubectl /usr/local/bin/
```

#### Minikube (Optional - for local Kubernetes)
```bash
curl -LO https://storage.googleapis.com/minikube/releases/latest/minikube-linux-amd64
sudo install minikube-linux-amd64 /usr/local/bin/minikube
```

## 🧪 Local Testing

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
# or
npm start
```

### 4. Test API Endpoints
```bash
# Health check
curl http://localhost:3000/health

# Main endpoint
curl http://localhost:3000/

# API endpoint
curl http://localhost:3000/api/users
```

## 🐳 Docker Deployment Options

### Option 1: Simple Docker Build & Run
```bash
# Build image
docker build -t cicd-docker-app .

# Run container
docker run -p 3000:3000 cicd-docker-app

# Test
curl http://localhost:3000/health
```

### Option 2: Docker Compose (Recommended)
```bash
# Start all services (app + nginx)
docker-compose up -d

# View logs
docker-compose logs -f

# Test via nginx (port 80)
curl http://localhost/health

# Stop services
docker-compose down
```

### Option 3: Automated Script
```bash
./scripts/deploy-local.sh
```

## ☸️ Kubernetes Deployment (Minikube)

### 1. Start Minikube
```bash
minikube start
```

### 2. Deploy Application
```bash
./scripts/deploy-minikube.sh
```

### 3. Access Application
```bash
# Get service URL
minikube service cicd-app-service --url -n cicd-app

# Or use port forwarding
kubectl port-forward service/cicd-app-service 8080:80 -n cicd-app
```

## 🔄 GitHub Actions CI/CD Setup

### 1. Create GitHub Repository
```bash
# Initialize git (if not already done)
git init
git add .
git commit -m "Initial CI/CD pipeline setup"

# Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/cicd-docker-app.git
git branch -M main
git push -u origin main
```

### 2. Set Up Docker Hub
1. Create account at [hub.docker.com](https://hub.docker.com)
2. Create repository: `your-username/cicd-docker-app`
3. Generate access token in Docker Hub settings

### 3. Configure GitHub Secrets
Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:
```
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-access-token
SNYK_TOKEN=your-snyk-token (optional)
```

### 4. Update Workflow Configuration
Edit `.github/workflows/ci-cd.yml`:
```yaml
env:
  DOCKER_IMAGE: your-dockerhub-username/cicd-docker-app  # Update this line
```

### 5. Test Pipeline
```bash
# Push to main branch to trigger full pipeline
git add .
git commit -m "Configure CI/CD pipeline"
git push origin main

# Check Actions tab in GitHub repository
```

## 📊 Pipeline Stages

The CI/CD pipeline includes:

1. **🧪 Test Stage**
   - Install dependencies
   - Run unit tests
   - Generate coverage reports
   - Upload to Codecov

2. **🔒 Security Stage**
   - NPM audit for vulnerabilities
   - Snyk security scanning
   - Dependency checks

3. **🏗️ Build & Push Stage**
   - Build multi-architecture Docker image
   - Push to Docker Hub
   - Run Trivy vulnerability scan
   - Generate SBOM (Software Bill of Materials)

4. **🚀 Deploy Stages**
   - Deploy to staging environment
   - Run smoke tests
   - Deploy to production (manual approval)
   - Post-deployment verification

## 🔍 Monitoring & Debugging

### Application Logs
```bash
# Docker logs
docker logs cicd-app-local

# Kubernetes logs
kubectl logs -f deployment/cicd-app -n cicd-app

# Docker Compose logs
docker-compose logs -f app
```

### Health Checks
```bash
# Local development
curl http://localhost:3000/health

# Docker deployment
curl http://localhost:3000/health

# Kubernetes deployment
kubectl get pods -n cicd-app
kubectl describe pod <pod-name> -n cicd-app
```

### Container Shell Access
```bash
# Docker
docker exec -it cicd-app-local sh

# Kubernetes
kubectl exec -it deployment/cicd-app -n cicd-app -- sh
```

## 🚨 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   ```bash
   lsof -i :3000
   kill -9 <PID>
   ```

2. **Docker daemon not running**
   ```bash
   sudo systemctl start docker
   # or start Docker Desktop
   ```

3. **Permission denied (Docker)**
   ```bash
   sudo usermod -aG docker $USER
   # Log out and back in
   ```

4. **Minikube won't start**
   ```bash
   minikube delete
   minikube start --driver=docker
   ```

5. **Tests failing in CI**
   - Check Node.js version compatibility
   - Verify all dependencies are in package.json
   - Check for environment-specific issues

## 📈 Next Steps & Enhancements

### Immediate Tasks
- [ ] Install prerequisites using `./scripts/setup.sh`
- [ ] Test local development with `npm install && npm test`
- [ ] Test Docker deployment with `./scripts/deploy-local.sh`
- [ ] Create GitHub repository and configure secrets
- [ ] Test CI/CD pipeline by pushing to main branch

### Future Enhancements
- [ ] Add ESLint for code quality
- [ ] Implement multi-stage Docker builds
- [ ] Add database integration (PostgreSQL/MongoDB)
- [ ] Implement proper logging (Winston/Pino)
- [ ] Add API documentation (Swagger/OpenAPI)
- [ ] Implement authentication (JWT)
- [ ] Add monitoring (Prometheus/Grafana)
- [ ] Set up staging/production environments
- [ ] Implement blue-green deployments
- [ ] Add performance testing (Artillery/k6)

### Security Improvements
- [ ] Implement HTTPS/TLS
- [ ] Add rate limiting
- [ ] Implement input validation
- [ ] Add security headers
- [ ] Set up vulnerability scanning
- [ ] Implement secrets management

## 📚 Learning Resources

- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Kubernetes Tutorials](https://kubernetes.io/docs/tutorials/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)
- [CI/CD Best Practices](https://docs.github.com/en/actions/guides/about-continuous-integration)

## 🎯 Success Criteria

Your CI/CD pipeline is successful when:
- ✅ All tests pass locally and in CI
- ✅ Docker image builds and runs successfully
- ✅ Application deploys to local environments
- ✅ GitHub Actions workflow completes without errors
- ✅ Security scans pass with acceptable risk levels
- ✅ Application is accessible and responds to health checks

---

**Happy coding! 🚀**

For questions or issues, check the troubleshooting section or create an issue in the repository.
