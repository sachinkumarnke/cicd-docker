const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/static', express.static(path.join(__dirname, 'public')));

// Request logging middleware
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path} - ${req.ip}`);
  next();
});

// CORS middleware for development
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Sample data store (in production, use a real database)
let users = [
  { id: 1, name: 'John Doe', email: 'john@example.com', role: 'admin', createdAt: '2024-01-01T00:00:00Z', avatar: 'https://ui-avatars.com/api/?name=John+Doe&background=0d6efd&color=fff' },
  { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'user', createdAt: '2024-01-02T00:00:00Z', avatar: 'https://ui-avatars.com/api/?name=Jane+Smith&background=198754&color=fff' },
  { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'user', createdAt: '2024-01-03T00:00:00Z', avatar: 'https://ui-avatars.com/api/?name=Bob+Johnson&background=dc3545&color=fff' },
  { id: 4, name: 'Alice Wilson', email: 'alice@example.com', role: 'moderator', createdAt: '2024-01-04T00:00:00Z', avatar: 'https://ui-avatars.com/api/?name=Alice+Wilson&background=fd7e14&color=fff' },
  { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'user', createdAt: '2024-01-05T00:00:00Z', avatar: 'https://ui-avatars.com/api/?name=Charlie+Brown&background=6f42c1&color=fff' }
];

// Main web interface route
app.get('/', (req, res) => {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>CI/CD Docker App - Professional DevOps Dashboard</title>
    <meta name="description" content="Modern CI/CD Docker application with comprehensive monitoring, user management, and API testing capabilities">
    <meta name="keywords" content="CI/CD, Docker, DevOps, Node.js, API, Dashboard, Monitoring">
    <meta name="author" content="DevOps Team">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/themes/prism-tomorrow.min.css" rel="stylesheet">
    <style>
        :root {
            --primary-color: #0d6efd;
            --secondary-color: #6c757d;
            --success-color: #198754;
            --danger-color: #dc3545;
            --warning-color: #fd7e14;
            --info-color: #0dcaf0;
            --dark-color: #212529;
            --light-color: #f8f9fa;
            --gradient-primary: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            --gradient-secondary: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
            --gradient-success: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: var(--gradient-primary);
            min-height: 100vh;
            color: #333;
            line-height: 1.6;
            padding-top: 80px; /* Account for fixed navbar */
        }

        /* Ensure all text is visible */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        /* Fix for navbar text visibility */
        .navbar-light .navbar-nav .nav-link {
            color: #212529 !important;
            font-weight: 600 !important;
        }

        .navbar-light .navbar-nav .nav-link:hover,
        .navbar-light .navbar-nav .nav-link:focus {
            color: var(--primary-color) !important;
        }

        .navbar-light .navbar-brand {
            color: var(--primary-color) !important;
            font-weight: 700 !important;
        }

        .navbar-light .navbar-brand:hover,
        .navbar-light .navbar-brand:focus {
            color: var(--primary-color) !important;
        }

        /* Additional navbar visibility fixes */
        .navbar .nav-link,
        .navbar-nav .nav-link,
        .nav-link {
            color: #212529 !important;
            font-weight: 600 !important;
            text-decoration: none !important;
        }

        .navbar .nav-link:hover,
        .navbar-nav .nav-link:hover,
        .nav-link:hover {
            color: var(--primary-color) !important;
            text-decoration: none !important;
        }

        /* Ensure icons are visible too */
        .navbar .nav-link i,
        .navbar-brand i {
            color: inherit !important;
        }
        .navbar-custom {
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(15px);
            border-bottom: 1px solid rgba(0, 0, 0, 0.1);
            box-shadow: 0 2px 20px rgba(0, 0, 0, 0.15);
            padding: 1rem 0;
        }

        .navbar-brand {
            font-weight: 700 !important;
            font-size: 1.5rem !important;
            color: var(--primary-color) !important;
            text-decoration: none !important;
        }

        .navbar-brand:hover {
            color: var(--primary-color) !important;
            text-decoration: none !important;
        }

        .nav-link {
            font-weight: 600 !important;
            color: var(--dark-color) !important;
            transition: all 0.3s ease;
            padding: 0.5rem 1rem !important;
            border-radius: 8px;
            margin: 0 0.2rem;
        }

        .nav-link:hover {
            color: var(--primary-color) !important;
            background-color: rgba(13, 110, 253, 0.1) !important;
            transform: translateY(-2px);
        }

        .nav-link.active {
            color: var(--primary-color) !important;
            background-color: rgba(13, 110, 253, 0.15) !important;
            font-weight: 700 !important;
        }

        .navbar-toggler {
            border: 2px solid var(--primary-color) !important;
            padding: 0.5rem;
        }

        .navbar-toggler:focus {
            box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25) !important;
        }

        .navbar-toggler-icon {
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%2813, 110, 253, 1%29' stroke-linecap='round' stroke-miterlimit='10' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e") !important;
        }

        /* Ensure navbar text is visible on all backgrounds */
        .navbar-nav .nav-link {
            color: #212529 !important;
            font-weight: 600 !important;
        }

        .navbar-nav .nav-link:hover,
        .navbar-nav .nav-link:focus {
            color: var(--primary-color) !important;
        }

        /* Mobile navbar improvements */
        @media (max-width: 991.98px) {
            .navbar-collapse {
                background: rgba(255, 255, 255, 0.98);
                border-radius: 10px;
                padding: 1rem;
                margin-top: 1rem;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            
            .nav-link {
                padding: 0.75rem 1rem !important;
                margin: 0.2rem 0;
            }
        }

        /* Dashboard Container */
        .dashboard-container {
            min-height: 100vh;
            padding: 2rem 0;
        }

        /* Glass Card Effects */
        .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
            overflow: hidden;
        }

        .glass-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .glass-card-dark {
            background: rgba(33, 37, 41, 0.95);
            color: white;
        }

        /* Header Cards */
        .header-card {
            background: var(--gradient-primary);
            color: white;
            border: none;
        }

        .hero-section {
            background: var(--gradient-primary);
            color: white;
            padding: 4rem 0;
            text-align: center;
        }

        .hero-title {
            font-size: 3.5rem;
            font-weight: 700;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.3);
        }

        .hero-subtitle {
            font-size: 1.3rem;
            margin-bottom: 2rem;
            opacity: 0.9;
        }

        /* Statistics Cards */
        .stat-card {
            text-align: center;
            padding: 2rem;
            height: 100%;
            position: relative;
            overflow: hidden;
        }

        .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 4px;
            background: var(--gradient-primary);
        }

        .stat-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            opacity: 0.8;
        }

        .stat-number {
            font-size: 2.5rem;
            font-weight: 700;
            margin-bottom: 0.5rem;
        }

        .stat-label {
            font-size: 0.9rem;
            opacity: 0.8;
            text-transform: uppercase;
            letter-spacing: 1px;
            font-weight: 500;
        }

        /* Health Indicators */
        .health-indicator {
            display: inline-flex;
            align-items: center;
            gap: 0.5rem;
            padding: 0.5rem 1rem;
            border-radius: 50px;
            font-weight: 500;
            font-size: 0.9rem;
        }

        .health-healthy {
            background: rgba(25, 135, 84, 0.1);
            color: var(--success-color);
            border: 1px solid rgba(25, 135, 84, 0.2);
        }

        /* User Cards */
        .user-card {
            transition: all 0.3s ease;
            border: none;
            border-radius: 15px;
            overflow: hidden;
            position: relative;
        }

        .user-card::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            height: 3px;
            background: var(--gradient-primary);
        }

        .user-card:hover {
            transform: translateY(-3px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
        }

        .user-avatar {
            width: 60px;
            height: 60px;
            border-radius: 50%;
            object-fit: cover;
            border: 3px solid #fff;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
        }

        /* Role Badges */
        .role-badge {
            font-size: 0.75rem;
            padding: 0.25rem 0.75rem;
            border-radius: 50px;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }

        .role-admin {
            background: rgba(220, 53, 69, 0.1);
            color: var(--danger-color);
            border: 1px solid rgba(220, 53, 69, 0.2);
        }

        .role-user {
            background: rgba(13, 110, 253, 0.1);
            color: var(--primary-color);
            border: 1px solid rgba(13, 110, 253, 0.2);
        }

        .role-moderator {
            background: rgba(253, 126, 20, 0.1);
            color: var(--warning-color);
            border: 1px solid rgba(253, 126, 20, 0.2);
        }

        /* API Endpoints */
        .api-endpoint {
            background: rgba(108, 117, 125, 0.05);
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 1rem;
            border-left: 4px solid var(--primary-color);
            transition: all 0.3s ease;
        }

        .api-endpoint:hover {
            background: rgba(108, 117, 125, 0.1);
            transform: translateX(5px);
        }

        .method-badge {
            font-size: 0.7rem;
            padding: 0.2rem 0.6rem;
            border-radius: 4px;
            font-weight: 600;
            margin-right: 0.5rem;
        }

        .method-get {
            background: var(--success-color);
            color: white;
        }

        .method-post {
            background: var(--warning-color);
            color: white;
        }

        /* Code Blocks */
        .code-block {
            background: #2d3748;
            color: #e2e8f0;
            padding: 1rem;
            border-radius: 8px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9rem;
            overflow-x: auto;
        }

        /* Buttons */
        .btn-custom {
            border-radius: 50px;
            padding: 0.75rem 2rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
            border: none;
        }

        .btn-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .btn-gradient {
            background: var(--gradient-primary);
            color: white;
        }

        .btn-gradient:hover {
            background: var(--gradient-secondary);
            color: white;
        }

        /* Section Titles */
        .section-title {
            font-size: 1.8rem;
            font-weight: 600;
            margin-bottom: 1.5rem;
            color: var(--dark-color);
            position: relative;
            padding-left: 1rem;
        }

        .section-title::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 4px;
            height: 30px;
            background: var(--gradient-primary);
            border-radius: 2px;
        }

        /* Feature Cards */
        .feature-card {
            text-align: center;
            padding: 2rem;
            height: 100%;
            border-radius: 15px;
            transition: all 0.3s ease;
        }

        .feature-card:hover {
            transform: translateY(-5px);
        }

        .feature-icon {
            font-size: 3rem;
            margin-bottom: 1rem;
            background: var(--gradient-primary);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            background-clip: text;
        }

        /* Documentation Sections */
        .doc-section {
            margin-bottom: 3rem;
        }

        .doc-nav {
            position: sticky;
            top: 100px;
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 15px;
            padding: 1.5rem;
        }

        .doc-nav .nav-link {
            color: var(--dark-color);
            padding: 0.5rem 1rem;
            border-radius: 8px;
            transition: all 0.3s ease;
        }

        .doc-nav .nav-link:hover,
        .doc-nav .nav-link.active {
            background: var(--primary-color);
            color: white !important;
        }

        /* Animations */
        .loading-spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            border-top-color: #fff;
            animation: spin 1s ease-in-out infinite;
        }

        @keyframes spin {
            to { transform: rotate(360deg); }
        }

        .fade-in {
            animation: fadeIn 0.6s ease-in;
        }

        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }

        .pulse {
            animation: pulse 2s infinite;
        }

        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.05); }
            100% { transform: scale(1); }
        }

        .slide-in-left {
            animation: slideInLeft 0.6s ease-out;
        }

        @keyframes slideInLeft {
            from { opacity: 0; transform: translateX(-50px); }
            to { opacity: 1; transform: translateX(0); }
        }

        .slide-in-right {
            animation: slideInRight 0.6s ease-out;
        }

        @keyframes slideInRight {
            from { opacity: 0; transform: translateX(50px); }
            to { opacity: 1; transform: translateX(0); }
        }

        /* Responsive Design */
        @media (max-width: 768px) {
            .hero-title {
                font-size: 2.5rem;
            }
            
            .dashboard-container {
                padding: 1rem 0;
            }
            
            .stat-card {
                padding: 1.5rem;
            }
            
            .stat-number {
                font-size: 2rem;
            }
            
            .stat-icon {
                font-size: 2.5rem;
            }

            .section-title {
                font-size: 1.5rem;
            }
        }

        /* Dark Mode Support */
        @media (prefers-color-scheme: dark) {
            .glass-card {
                background: rgba(33, 37, 41, 0.95);
                color: white;
            }
            
            .navbar-custom {
                background: rgba(33, 37, 41, 0.95);
            }
        }

        /* Text Visibility Improvements */
        .text-muted {
            color: #6c757d !important;
            font-weight: 500;
        }

        .hero-subtitle {
            font-size: 1.3rem;
            margin-bottom: 2rem;
            opacity: 0.95;
            font-weight: 500;
            text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3);
        }

        .lead {
            font-size: 1.1rem;
            font-weight: 500;
            color: #495057;
        }

        .card-text {
            color: #495057 !important;
            font-weight: 500;
        }

        /* Enhanced contrast for better readability */
        .glass-card {
            background: rgba(255, 255, 255, 0.98) !important;
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.3);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
            transition: all 0.3s ease;
            overflow: hidden;
        }

        .glass-card p, .glass-card li {
            color: #495057 !important;
            font-weight: 500;
        }

        /* Project Overview Section */
        .project-overview {
            background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
            padding: 5rem 0;
        }

        .overview-card {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            margin-bottom: 2rem;
            border-left: 5px solid var(--primary-color);
        }

        .overview-title {
            color: var(--primary-color);
            font-weight: 700;
            margin-bottom: 1rem;
        }

        .overview-text {
            color: #495057;
            font-size: 1.1rem;
            line-height: 1.7;
            font-weight: 500;
        }

        /* Diagram Styles */
        .diagram-container {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            margin: 2rem 0;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            text-align: center;
        }

        .diagram-title {
            color: var(--primary-color);
            font-weight: 700;
            margin-bottom: 1.5rem;
            font-size: 1.3rem;
        }

        .flow-diagram {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 1rem;
            margin: 2rem 0;
        }

        .flow-step {
            background: var(--gradient-primary);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 10px;
            font-weight: 600;
            text-align: center;
            min-width: 150px;
            position: relative;
        }

        .flow-step::after {
            content: '→';
            position: absolute;
            right: -20px;
            top: 50%;
            transform: translateY(-50%);
            font-size: 1.5rem;
            color: var(--primary-color);
        }

        .flow-step:last-child::after {
            display: none;
        }

        .architecture-diagram {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 2rem;
            margin: 2rem 0;
        }

        .arch-component {
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            border: 2px solid var(--primary-color);
            border-radius: 10px;
            padding: 1.5rem;
            text-align: center;
            transition: all 0.3s ease;
        }

        .arch-component:hover {
            transform: translateY(-5px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .arch-icon {
            font-size: 2.5rem;
            color: var(--primary-color);
            margin-bottom: 1rem;
        }

        .arch-title {
            font-weight: 700;
            color: var(--dark-color);
            margin-bottom: 0.5rem;
        }

        .arch-desc {
            color: #6c757d;
            font-size: 0.9rem;
            font-weight: 500;
        }

        /* Technology Stack Visualization */
        .tech-stack {
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
            gap: 1.5rem;
            margin: 2rem 0;
        }

        .tech-item {
            background: white;
            border: 2px solid #e9ecef;
            border-radius: 10px;
            padding: 1rem;
            text-align: center;
            min-width: 120px;
            transition: all 0.3s ease;
        }

        .tech-item:hover {
            border-color: var(--primary-color);
            transform: translateY(-3px);
        }

        .tech-icon {
            font-size: 2rem;
            margin-bottom: 0.5rem;
        }

        .tech-name {
            font-weight: 600;
            color: var(--dark-color);
            font-size: 0.9rem;
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav class="navbar navbar-expand-lg navbar-light navbar-custom fixed-top">
        <div class="container">
            <a class="navbar-brand fw-bold" href="#home">
                <i class="fas fa-rocket me-2"></i>
                CI/CD Docker App
            </a>
            <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
                <ul class="navbar-nav ms-auto">
                    <li class="nav-item">
                        <a class="nav-link fw-semibold" href="#home">
                            <i class="fas fa-home me-1"></i>Home
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fw-semibold" href="#overview">
                            <i class="fas fa-info-circle me-1"></i>Overview
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fw-semibold" href="#dashboard">
                            <i class="fas fa-tachometer-alt me-1"></i>Dashboard
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fw-semibold" href="#features">
                            <i class="fas fa-star me-1"></i>Features
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fw-semibold" href="#documentation">
                            <i class="fas fa-book me-1"></i>Documentation
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fw-semibold" href="#api">
                            <i class="fas fa-code me-1"></i>API
                        </a>
                    </li>
                    <li class="nav-item">
                        <a class="nav-link fw-semibold" href="https://github.com/sachinkumarnke/cicd-docker" target="_blank">
                            <i class="fab fa-github me-1"></i>GitHub
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </nav>

    <!-- Hero Section -->
    <section id="home" class="hero-section">
        <div class="container">
            <div class="row justify-content-center text-center">
                <div class="col-lg-8">
                    <h1 class="hero-title fade-in">
                        <i class="fas fa-rocket me-3"></i>
                        CI/CD Docker App
                    </h1>
                    <p class="hero-subtitle fade-in" style="animation-delay: 0.2s">
                        Professional DevOps Dashboard with Real-time Monitoring, User Management, and Comprehensive API Testing
                    </p>
                    <div class="fade-in" style="animation-delay: 0.4s">
                        <a href="#dashboard" class="btn btn-light btn-custom me-3">
                            <i class="fas fa-play me-2"></i>View Dashboard
                        </a>
                        <a href="#documentation" class="btn btn-outline-light btn-custom">
                            <i class="fas fa-book me-2"></i>Documentation
                        </a>
                    </div>
                    <div class="mt-4 fade-in" style="animation-delay: 0.6s">
                        <span class="badge bg-light text-dark px-3 py-2 me-2">
                            <i class="fas fa-code-branch me-2"></i>Version 1.0.1
                        </span>
                        <span class="badge bg-light text-dark px-3 py-2 me-2">
                            <i class="fas fa-server me-2"></i>Node.js 18+
                        </span>
                        <span class="badge bg-light text-dark px-3 py-2 me-2">
                            <i class="fab fa-docker me-2"></i>Docker Ready
                        </span>
                        <span class="badge bg-light text-dark px-3 py-2">
                            <i class="fas fa-shield-alt me-2"></i>Security Scanned
                        </span>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Project Overview Section -->
    <section id="overview" class="project-overview">
        <div class="container">
            <div class="row mb-5">
                <div class="col-12 text-center">
                    <h2 class="section-title text-center">
                        <i class="fas fa-info-circle me-2"></i>
                        What This Project Does
                    </h2>
                    <p class="lead">A complete CI/CD pipeline demonstration with modern DevOps practices</p>
                </div>
            </div>

            <!-- Project Description -->
            <div class="row mb-5">
                <div class="col-lg-8 mx-auto">
                    <div class="overview-card">
                        <h3 class="overview-title">
                            <i class="fas fa-rocket me-2"></i>
                            Complete DevOps Solution
                        </h3>
                        <p class="overview-text">
                            This project demonstrates a <strong>production-ready CI/CD pipeline</strong> using modern DevOps tools and practices. 
                            It showcases how to build, test, secure, and deploy a Node.js application using Docker containers, 
                            GitHub Actions, and comprehensive monitoring capabilities.
                        </p>
                        <p class="overview-text">
                            The application serves as both a <strong>functional web dashboard</strong> and a <strong>learning resource</strong> 
                            for developers wanting to understand modern DevOps workflows, containerization, and automated deployment strategies.
                        </p>
                    </div>
                </div>
            </div>

            <!-- CI/CD Pipeline Flow Diagram -->
            <div class="diagram-container">
                <h3 class="diagram-title">
                    <i class="fas fa-code-branch me-2"></i>
                    CI/CD Pipeline Flow
                </h3>
                <div class="flow-diagram">
                    <div class="flow-step">
                        <i class="fab fa-github d-block mb-2"></i>
                        Code Push
                    </div>
                    <div class="flow-step">
                        <i class="fas fa-vial d-block mb-2"></i>
                        Run Tests
                    </div>
                    <div class="flow-step">
                        <i class="fas fa-shield-alt d-block mb-2"></i>
                        Security Scan
                    </div>
                    <div class="flow-step">
                        <i class="fab fa-docker d-block mb-2"></i>
                        Build Image
                    </div>
                    <div class="flow-step">
                        <i class="fas fa-cloud-upload-alt d-block mb-2"></i>
                        Deploy
                    </div>
                </div>
                <p class="text-muted mt-3">
                    Automated pipeline triggered on every code push, ensuring quality and security at each step
                </p>
            </div>

            <!-- Architecture Diagram -->
            <div class="diagram-container">
                <h3 class="diagram-title">
                    <i class="fas fa-sitemap me-2"></i>
                    System Architecture
                </h3>
                <div class="architecture-diagram">
                    <div class="arch-component">
                        <div class="arch-icon">
                            <i class="fas fa-globe"></i>
                        </div>
                        <h5 class="arch-title">Web Interface</h5>
                        <p class="arch-desc">Professional dashboard with real-time monitoring and user management</p>
                    </div>
                    <div class="arch-component">
                        <div class="arch-icon">
                            <i class="fas fa-server"></i>
                        </div>
                        <h5 class="arch-title">Node.js API</h5>
                        <p class="arch-desc">RESTful API with CRUD operations, validation, and error handling</p>
                    </div>
                    <div class="arch-component">
                        <div class="arch-icon">
                            <i class="fab fa-docker"></i>
                        </div>
                        <h5 class="arch-title">Docker Container</h5>
                        <p class="arch-desc">Multi-stage builds with security scanning and health checks</p>
                    </div>
                    <div class="arch-component">
                        <div class="arch-icon">
                            <i class="fas fa-balance-scale"></i>
                        </div>
                        <h5 class="arch-title">Load Balancer</h5>
                        <p class="arch-desc">Nginx reverse proxy with rate limiting and SSL termination</p>
                    </div>
                    <div class="arch-component">
                        <div class="arch-icon">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <h5 class="arch-title">Monitoring</h5>
                        <p class="arch-desc">Real-time health checks, metrics collection, and alerting</p>
                    </div>
                    <div class="arch-component">
                        <div class="arch-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h5 class="arch-title">Security</h5>
                        <p class="arch-desc">Vulnerability scanning, SBOM generation, and security headers</p>
                    </div>
                </div>
            </div>

            <!-- Technology Stack -->
            <div class="diagram-container">
                <h3 class="diagram-title">
                    <i class="fas fa-layer-group me-2"></i>
                    Technology Stack
                </h3>
                <div class="tech-stack">
                    <div class="tech-item">
                        <div class="tech-icon">
                            <i class="fab fa-node-js" style="color: #339933;"></i>
                        </div>
                        <div class="tech-name">Node.js</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-icon">
                            <i class="fab fa-js-square" style="color: #f7df1e;"></i>
                        </div>
                        <div class="tech-name">Express.js</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-icon">
                            <i class="fab fa-docker" style="color: #2496ed;"></i>
                        </div>
                        <div class="tech-name">Docker</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-icon">
                            <i class="fab fa-github" style="color: #333;"></i>
                        </div>
                        <div class="tech-name">GitHub Actions</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-icon">
                            <i class="fab fa-bootstrap" style="color: #7952b3;"></i>
                        </div>
                        <div class="tech-name">Bootstrap 5</div>
                    </div>
                    <div class="tech-item">
                        <div class="tech-icon">
                            <i class="fas fa-code" style="color: #e34c26;"></i>
                        </div>
                        <div class="tech-name">HTML5/CSS3</div>
                    </div>
                </div>
            </div>

            <!-- Key Features Overview -->
            <div class="row">
                <div class="col-md-6">
                    <div class="overview-card">
                        <h4 class="overview-title">
                            <i class="fas fa-cogs me-2"></i>
                            DevOps Features
                        </h4>
                        <ul class="list-unstyled">
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i><strong>Automated CI/CD Pipeline</strong> - GitHub Actions workflow</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i><strong>Multi-stage Docker Builds</strong> - Optimized production images</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i><strong>Security Scanning</strong> - Trivy and Snyk integration</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i><strong>Health Monitoring</strong> - Comprehensive health checks</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i><strong>Load Balancing</strong> - Nginx reverse proxy</li>
                        </ul>
                    </div>
                </div>
                <div class="col-md-6">
                    <div class="overview-card">
                        <h4 class="overview-title">
                            <i class="fas fa-laptop-code me-2"></i>
                            Development Features
                        </h4>
                        <ul class="list-unstyled">
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i><strong>REST API</strong> - Complete CRUD operations</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i><strong>Real-time Dashboard</strong> - Live monitoring interface</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i><strong>Comprehensive Testing</strong> - Unit and integration tests</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i><strong>Interactive Documentation</strong> - API testing capabilities</li>
                            <li class="mb-2"><i class="fas fa-check text-success me-2"></i><strong>Responsive Design</strong> - Mobile-first approach</li>
                        </ul>
                    </div>
                </div>
            </div>

            <!-- Use Cases -->
            <div class="row mt-4">
                <div class="col-12">
                    <div class="overview-card">
                        <h4 class="overview-title">
                            <i class="fas fa-lightbulb me-2"></i>
                            Perfect For Learning
                        </h4>
                        <div class="row">
                            <div class="col-md-4">
                                <h6 class="text-primary"><i class="fas fa-graduation-cap me-2"></i>Students</h6>
                                <p class="overview-text">Learn modern DevOps practices, containerization, and CI/CD pipelines through hands-on experience.</p>
                            </div>
                            <div class="col-md-4">
                                <h6 class="text-primary"><i class="fas fa-code me-2"></i>Developers</h6>
                                <p class="overview-text">Understand how to implement automated testing, security scanning, and deployment strategies.</p>
                            </div>
                            <div class="col-md-4">
                                <h6 class="text-primary"><i class="fas fa-briefcase me-2"></i>Professionals</h6>
                                <p class="overview-text">Showcase technical skills with a production-ready application demonstrating best practices.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    <section id="features" class="py-5">
        <div class="container">
            <div class="row mb-5">
                <div class="col-12 text-center">
                    <h2 class="section-title text-center">
                        <i class="fas fa-star me-2"></i>
                        Key Features
                    </h2>
                    <p class="lead text-muted">Everything you need for modern DevOps workflows</p>
                </div>
            </div>
            <div class="row g-4">
                <div class="col-md-4">
                    <div class="glass-card feature-card fade-in">
                        <div class="feature-icon">
                            <i class="fas fa-tachometer-alt"></i>
                        </div>
                        <h4>Real-time Monitoring</h4>
                        <p class="text-muted">Live system health checks, memory usage tracking, and performance metrics with auto-refresh capabilities.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="glass-card feature-card fade-in" style="animation-delay: 0.2s">
                        <div class="feature-icon">
                            <i class="fas fa-users"></i>
                        </div>
                        <h4>User Management</h4>
                        <p class="text-muted">Complete CRUD operations for user management with role-based access control and avatar integration.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="glass-card feature-card fade-in" style="animation-delay: 0.4s">
                        <div class="feature-icon">
                            <i class="fas fa-code"></i>
                        </div>
                        <h4>REST API</h4>
                        <p class="text-muted">Comprehensive RESTful API with filtering, pagination, validation, and structured error handling.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="glass-card feature-card fade-in" style="animation-delay: 0.6s">
                        <div class="feature-icon">
                            <i class="fab fa-docker"></i>
                        </div>
                        <h4>Docker Ready</h4>
                        <p class="text-muted">Multi-stage Docker builds, optimized images, health checks, and production-ready containerization.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="glass-card feature-card fade-in" style="animation-delay: 0.8s">
                        <div class="feature-icon">
                            <i class="fas fa-shield-alt"></i>
                        </div>
                        <h4>Security First</h4>
                        <p class="text-muted">Vulnerability scanning with Trivy and Snyk, SBOM generation, and security best practices.</p>
                    </div>
                </div>
                <div class="col-md-4">
                    <div class="glass-card feature-card fade-in" style="animation-delay: 1s">
                        <div class="feature-icon">
                            <i class="fas fa-cogs"></i>
                        </div>
                        <h4>CI/CD Pipeline</h4>
                        <p class="text-muted">GitHub Actions workflow with automated testing, building, security scanning, and deployment.</p>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Dashboard Section -->
    <section id="dashboard" class="py-5 bg-light">
        <div class="container">
            <div class="row mb-5">
                <div class="col-12 text-center">
                    <h2 class="section-title text-center">
                        <i class="fas fa-tachometer-alt me-2"></i>
                        Live Dashboard
                    </h2>
                    <p class="lead text-muted">Real-time system monitoring and user management</p>
                </div>
            </div>

            <!-- Stats Row -->
            <div class="row mb-4">
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="glass-card stat-card fade-in" style="animation-delay: 0.1s">
                        <div class="stat-icon text-success">
                            <i class="fas fa-heartbeat pulse"></i>
                        </div>
                        <div class="stat-number text-success" id="uptime">--</div>
                        <div class="stat-label">Uptime (seconds)</div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="glass-card stat-card fade-in" style="animation-delay: 0.2s">
                        <div class="stat-icon text-primary">
                            <i class="fas fa-users"></i>
                        </div>
                        <div class="stat-number text-primary" id="userCount">--</div>
                        <div class="stat-label">Total Users</div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="glass-card stat-card fade-in" style="animation-delay: 0.3s">
                        <div class="stat-icon text-warning">
                            <i class="fas fa-memory"></i>
                        </div>
                        <div class="stat-number text-warning" id="memoryUsage">--</div>
                        <div class="stat-label">Memory (MB)</div>
                    </div>
                </div>
                <div class="col-md-3 col-sm-6 mb-3">
                    <div class="glass-card stat-card fade-in" style="animation-delay: 0.4s">
                        <div class="stat-icon text-info">
                            <i class="fas fa-chart-line"></i>
                        </div>
                        <div class="stat-number text-info" id="requestCount">0</div>
                        <div class="stat-label">API Requests</div>
                    </div>
                </div>
            </div>

            <!-- Health Status -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="glass-card p-4 fade-in" style="animation-delay: 0.5s">
                        <h3 class="section-title">
                            <i class="fas fa-stethoscope me-2"></i>
                            System Health
                        </h3>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="d-flex align-items-center mb-3">
                                    <span class="health-indicator health-healthy">
                                        <i class="fas fa-check-circle"></i>
                                        <span id="healthStatus">Checking...</span>
                                    </span>
                                </div>
                                <div class="mb-2">
                                    <strong>Environment:</strong> 
                                    <span class="badge bg-secondary ms-2" id="environment">--</span>
                                </div>
                                <div class="mb-2">
                                    <strong>Last Updated:</strong> 
                                    <span id="lastUpdated">--</span>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="mb-2">
                                    <strong>Memory Usage:</strong>
                                    <div class="progress mt-2" style="height: 8px;">
                                        <div class="progress-bar bg-warning" role="progressbar" id="memoryProgress" style="width: 0%"></div>
                                    </div>
                                    <small class="text-muted" id="memoryDetails">--</small>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Users Section -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="glass-card p-4 fade-in" style="animation-delay: 0.6s">
                        <div class="d-flex justify-content-between align-items-center mb-4">
                            <h3 class="section-title mb-0">
                                <i class="fas fa-users me-2"></i>
                                User Management
                            </h3>
                            <button class="btn btn-primary btn-custom" onclick="refreshUsers()">
                                <i class="fas fa-sync-alt me-2"></i>Refresh
                            </button>
                        </div>
                        
                        <!-- User Filters -->
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <select class="form-select" id="roleFilter" onchange="filterUsers()">
                                    <option value="">All Roles</option>
                                    <option value="admin">Admin</option>
                                    <option value="moderator">Moderator</option>
                                    <option value="user">User</option>
                                </select>
                            </div>
                            <div class="col-md-6">
                                <input type="number" class="form-control" id="limitFilter" placeholder="Limit results" min="1" max="50" onchange="filterUsers()">
                            </div>
                        </div>

                        <div id="usersContainer" class="row">
                            <!-- Users will be loaded here -->
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Documentation Section -->
    <section id="documentation" class="py-5">
        <div class="container">
            <div class="row mb-5">
                <div class="col-12 text-center">
                    <h2 class="section-title text-center">
                        <i class="fas fa-book me-2"></i>
                        Documentation
                    </h2>
                    <p class="lead text-muted">Complete guide to get started with the CI/CD Docker App</p>
                </div>
            </div>
            
            <div class="row">
                <div class="col-lg-3">
                    <div class="doc-nav">
                        <h5 class="mb-3">Quick Navigation</h5>
                        <nav class="nav flex-column">
                            <a class="nav-link active" href="#quick-start">Quick Start</a>
                            <a class="nav-link" href="#installation">Installation</a>
                            <a class="nav-link" href="#docker-setup">Docker Setup</a>
                            <a class="nav-link" href="#api-usage">API Usage</a>
                            <a class="nav-link" href="#testing">Testing</a>
                            <a class="nav-link" href="#deployment">Deployment</a>
                        </nav>
                    </div>
                </div>
                
                <div class="col-lg-9">
                    <!-- Quick Start -->
                    <div class="doc-section" id="quick-start">
                        <div class="glass-card p-4">
                            <h3><i class="fas fa-rocket me-2"></i>Quick Start</h3>
                            <p>Get the CI/CD Docker App running in minutes:</p>
                            
                            <h5>1. Clone the Repository</h5>
                            <div class="code-block mb-3">
git clone https://github.com/sachinkumarnke/cicd-docker.git
cd cicd-docker</div>

                            <h5>2. Install Dependencies</h5>
                            <div class="code-block mb-3">
npm install</div>

                            <h5>3. Start the Application</h5>
                            <div class="code-block mb-3">
npm start</div>

                            <div class="alert alert-info">
                                <i class="fas fa-info-circle me-2"></i>
                                The application will be available at <strong>http://localhost:3000</strong>
                            </div>
                        </div>
                    </div>

                    <!-- Installation -->
                    <div class="doc-section" id="installation">
                        <div class="glass-card p-4">
                            <h3><i class="fas fa-download me-2"></i>Installation</h3>
                            
                            <h5>Prerequisites</h5>
                            <ul>
                                <li><strong>Node.js</strong> (v18 or higher)</li>
                                <li><strong>Docker</strong> and <strong>Docker Compose</strong></li>
                                <li><strong>Git</strong></li>
                                <li><strong>curl</strong> (for testing endpoints)</li>
                            </ul>

                            <h5>Development Setup</h5>
                            <div class="code-block mb-3">
# Install dependencies
npm install

# Run tests
npm test

# Start development server with auto-reload
npm run dev</div>

                            <h5>Available Scripts</h5>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Command</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><code>npm start</code></td>
                                            <td>Start the production server</td>
                                        </tr>
                                        <tr>
                                            <td><code>npm run dev</code></td>
                                            <td>Start development server with auto-reload</td>
                                        </tr>
                                        <tr>
                                            <td><code>npm test</code></td>
                                            <td>Run all tests</td>
                                        </tr>
                                        <tr>
                                            <td><code>npm run test:coverage</code></td>
                                            <td>Run tests with coverage report</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>

                    <!-- Docker Setup -->
                    <div class="doc-section" id="docker-setup">
                        <div class="glass-card p-4">
                            <h3><i class="fab fa-docker me-2"></i>Docker Setup</h3>
                            
                            <h5>Option 1: Quick Deployment Script</h5>
                            <div class="code-block mb-3">
./scripts/deploy-local.sh</div>
                            <p>This script will build the image, run health checks, and test all endpoints.</p>

                            <h5>Option 2: Docker Compose (Recommended)</h5>
                            <div class="code-block mb-3">
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down</div>

                            <h5>Option 3: Manual Docker Commands</h5>
                            <div class="code-block mb-3">
# Build the image
docker build -t cicd-docker-app:latest .

# Run the container
docker run -d \\
  --name cicd-app-local \\
  -p 3000:3000 \\
  -e NODE_ENV=production \\
  --restart unless-stopped \\
  cicd-docker-app:latest</div>

                            <div class="alert alert-success">
                                <i class="fas fa-check-circle me-2"></i>
                                <strong>Multi-stage builds</strong> ensure optimized production images with enhanced security.
                            </div>
                        </div>
                    </div>

                    <!-- API Usage -->
                    <div class="doc-section" id="api-usage">
                        <div class="glass-card p-4">
                            <h3><i class="fas fa-code me-2"></i>API Usage</h3>
                            
                            <h5>Base URL</h5>
                            <div class="code-block mb-3">
http://localhost:3000</div>

                            <h5>Authentication</h5>
                            <p>Currently, no authentication is required. In production, implement proper authentication mechanisms.</p>

                            <h5>Response Format</h5>
                            <p>All API responses follow a consistent structure:</p>
                            <div class="code-block mb-3">
{
  "success": true,
  "data": {...},
  "count": 3,
  "timestamp": "2024-01-01T00:00:00.000Z"
}</div>

                            <h5>Error Handling</h5>
                            <div class="code-block mb-3">
{
  "success": false,
  "error": "Error description",
  "timestamp": "2024-01-01T00:00:00.000Z"
}</div>
                        </div>
                    </div>

                    <!-- Testing -->
                    <div class="doc-section" id="testing">
                        <div class="glass-card p-4">
                            <h3><i class="fas fa-vial me-2"></i>Testing</h3>
                            
                            <h5>Automated Testing</h5>
                            <div class="code-block mb-3">
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch</div>

                            <h5>API Endpoint Testing</h5>
                            <div class="code-block mb-3">
# Test all endpoints
./scripts/test-endpoints.sh

# Test against different environment
./scripts/test-endpoints.sh http://staging.example.com</div>

                            <h5>Manual Testing Examples</h5>
                            <div class="code-block mb-3">
# Health check
curl http://localhost:3000/health

# Get all users
curl http://localhost:3000/api/users

# Create a new user
curl -X POST http://localhost:3000/api/users \\
  -H "Content-Type: application/json" \\
  -d '{"name":"John Doe","email":"john@example.com","role":"user"}'</div>
                        </div>
                    </div>

                    <!-- Deployment -->
                    <div class="doc-section" id="deployment">
                        <div class="glass-card p-4">
                            <h3><i class="fas fa-cloud me-2"></i>Deployment</h3>
                            
                            <h5>GitHub Actions CI/CD</h5>
                            <p>The project includes a comprehensive GitHub Actions workflow that:</p>
                            <ul>
                                <li>Runs automated tests and security scans</li>
                                <li>Builds multi-architecture Docker images</li>
                                <li>Performs vulnerability scanning with Trivy and Snyk</li>
                                <li>Generates SBOM for supply chain security</li>
                                <li>Deploys to staging and production environments</li>
                            </ul>

                            <h5>Required GitHub Secrets</h5>
                            <div class="code-block mb-3">
DOCKER_USERNAME=your-dockerhub-username
DOCKER_PASSWORD=your-dockerhub-password
SNYK_TOKEN=your-snyk-token (optional)</div>

                            <h5>Environment Variables</h5>
                            <div class="table-responsive">
                                <table class="table table-striped">
                                    <thead>
                                        <tr>
                                            <th>Variable</th>
                                            <th>Default</th>
                                            <th>Description</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr>
                                            <td><code>NODE_ENV</code></td>
                                            <td>development</td>
                                            <td>Application environment</td>
                                        </tr>
                                        <tr>
                                            <td><code>PORT</code></td>
                                            <td>3000</td>
                                            <td>Server port</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- API Section -->
    <section id="api" class="py-5 bg-light">
        <div class="container">
            <div class="row mb-5">
                <div class="col-12 text-center">
                    <h2 class="section-title text-center">
                        <i class="fas fa-code me-2"></i>
                        API Reference
                    </h2>
                    <p class="lead text-muted">Complete REST API documentation with interactive testing</p>
                </div>
            </div>
            
            <div class="row">
                <div class="col-12">
                    <div class="glass-card p-4">
                        <div class="row">
                            <div class="col-md-6">
                                <h4>Available Endpoints</h4>
                                <div class="api-endpoint">
                                    <span class="method-badge method-get">GET</span>
                                    <code>/health</code>
                                    <p class="mb-0 mt-2 text-muted">System health check with detailed metrics</p>
                                </div>
                                <div class="api-endpoint">
                                    <span class="method-badge method-get">GET</span>
                                    <code>/api/users</code>
                                    <p class="mb-0 mt-2 text-muted">Get all users with filtering and pagination</p>
                                    <small class="text-info">Query params: ?role=admin&limit=10</small>
                                </div>
                                <div class="api-endpoint">
                                    <span class="method-badge method-get">GET</span>
                                    <code>/api/users/:id</code>
                                    <p class="mb-0 mt-2 text-muted">Get specific user by ID</p>
                                </div>
                                <div class="api-endpoint">
                                    <span class="method-badge method-post">POST</span>
                                    <code>/api/users</code>
                                    <p class="mb-0 mt-2 text-muted">Create new user</p>
                                    <small class="text-info">Body: {"name":"John","email":"john@example.com","role":"user"}</small>
                                </div>
                                <div class="api-endpoint">
                                    <span class="method-badge method-get">GET</span>
                                    <code>/api</code>
                                    <p class="mb-0 mt-2 text-muted">API documentation and metadata</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <h4>Interactive Testing</h4>
                                <div class="mb-3">
                                    <button class="btn btn-success btn-custom me-2 mb-2" onclick="testEndpoint('/health')">
                                        <i class="fas fa-heartbeat me-1"></i>Test Health
                                    </button>
                                    <button class="btn btn-primary btn-custom me-2 mb-2" onclick="testEndpoint('/api/users')">
                                        <i class="fas fa-users me-1"></i>Test Users
                                    </button>
                                    <button class="btn btn-info btn-custom me-2 mb-2" onclick="testEndpoint('/api/users/1')">
                                        <i class="fas fa-user me-1"></i>Test User by ID
                                    </button>
                                    <button class="btn btn-warning btn-custom me-2 mb-2" onclick="testCreateUser()">
                                        <i class="fas fa-plus me-1"></i>Test Create User
                                    </button>
                                </div>
                                
                                <div class="text-center mt-4">
                                    <button class="btn btn-gradient btn-custom" onclick="testAllEndpoints()">
                                        <i class="fas fa-play me-2"></i>Test All Endpoints
                                    </button>
                                </div>
                                
                                <div class="mt-4">
                                    <h5>Response Preview</h5>
                                    <div id="apiResponse" class="code-block" style="min-height: 100px; max-height: 300px; overflow-y: auto;">
                                        Click any test button to see API response here...
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>

    <!-- Footer -->
    <footer class="bg-dark text-light py-5">
        <div class="container">
            <div class="row">
                <div class="col-md-4">
                    <h5>
                        <i class="fas fa-rocket me-2"></i>
                        CI/CD Docker App
                    </h5>
                    <p class="text-muted">Professional DevOps dashboard with comprehensive monitoring, user management, and API testing capabilities.</p>
                    <div class="d-flex gap-3">
                        <a href="https://github.com/sachinkumarnke/cicd-docker" class="text-light" target="_blank">
                            <i class="fab fa-github fa-2x"></i>
                        </a>
                        <a href="https://hub.docker.com/r/sachinkumarnke/cicd-docker" class="text-light" target="_blank">
                            <i class="fab fa-docker fa-2x"></i>
                        </a>
                    </div>
                </div>
                <div class="col-md-4">
                    <h5>Quick Links</h5>
                    <ul class="list-unstyled">
                        <li><a href="#home" class="text-muted">Home</a></li>
                        <li><a href="#overview" class="text-muted">Project Overview</a></li>
                        <li><a href="#dashboard" class="text-muted">Dashboard</a></li>
                        <li><a href="#features" class="text-muted">Features</a></li>
                        <li><a href="#documentation" class="text-muted">Documentation</a></li>
                        <li><a href="#api" class="text-muted">API Reference</a></li>
                    </ul>
                </div>
                <div class="col-md-4">
                    <h5>Technical Stack</h5>
                    <ul class="list-unstyled">
                        <li><i class="fab fa-node-js me-2"></i>Node.js 18+</li>
                        <li><i class="fab fa-js-square me-2"></i>Express.js</li>
                        <li><i class="fab fa-docker me-2"></i>Docker & Docker Compose</li>
                        <li><i class="fab fa-github me-2"></i>GitHub Actions</li>
                        <li><i class="fab fa-bootstrap me-2"></i>Bootstrap 5</li>
                    </ul>
                </div>
            </div>
            <hr class="my-4">
            <div class="row align-items-center">
                <div class="col-md-6">
                    <p class="mb-0">&copy; 2024 DevOps Team. All rights reserved.</p>
                </div>
                <div class="col-md-6 text-md-end">
                    <span class="badge bg-primary me-2">Version 1.0.1</span>
                    <span class="badge bg-success">Production Ready</span>
                </div>
            </div>
        </div>
    </footer>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/components/prism-core.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/prism/1.29.0/plugins/autoloader/prism-autoloader.min.js"></script>
    <script>
        let requestCount = 0;

        // Smooth scrolling for navigation links
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            });
        });

        // Update active navigation link on scroll
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (scrollY >= (sectionTop - 200)) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === '#' + current) {
                    link.classList.add('active');
                }
            });
        });

        // Update request counter
        function updateRequestCount() {
            requestCount++;
            document.getElementById('requestCount').textContent = requestCount;
        }

        // Load health data
        async function loadHealthData() {
            try {
                updateRequestCount();
                const response = await fetch('/health');
                const data = await response.json();
                
                document.getElementById('healthStatus').textContent = data.status.charAt(0).toUpperCase() + data.status.slice(1);
                document.getElementById('uptime').textContent = Math.round(data.uptime);
                document.getElementById('environment').textContent = data.environment;
                document.getElementById('lastUpdated').textContent = new Date(data.timestamp).toLocaleString();
                
                // Memory usage
                const memoryMB = Math.round(data.memory.heapUsed / 1024 / 1024);
                const memoryTotalMB = Math.round(data.memory.heapTotal / 1024 / 1024);
                const memoryPercent = Math.round((data.memory.heapUsed / data.memory.heapTotal) * 100);
                
                document.getElementById('memoryUsage').textContent = memoryMB;
                document.getElementById('memoryProgress').style.width = memoryPercent + '%';
                document.getElementById('memoryDetails').textContent = \`\${memoryMB}MB / \${memoryTotalMB}MB (\${memoryPercent}%)\`;
                
            } catch (error) {
                console.error('Error loading health data:', error);
                document.getElementById('healthStatus').textContent = 'Error';
            }
        }

        // Load users data
        async function loadUsers(role = '', limit = '') {
            try {
                updateRequestCount();
                let url = '/api/users';
                const params = new URLSearchParams();
                if (role) params.append('role', role);
                if (limit) params.append('limit', limit);
                if (params.toString()) url += '?' + params.toString();
                
                const response = await fetch(url);
                const data = await response.json();
                
                document.getElementById('userCount').textContent = data.count;
                
                const container = document.getElementById('usersContainer');
                container.innerHTML = '';
                
                data.data.forEach((user, index) => {
                    const userCard = \`
                        <div class="col-md-6 col-lg-4 mb-3">
                            <div class="card user-card h-100 fade-in" style="animation-delay: \${index * 0.1}s">
                                <div class="card-body text-center">
                                    <img src="\${user.avatar}" alt="\${user.name}" class="user-avatar mb-3">
                                    <h5 class="card-title mb-2">\${user.name}</h5>
                                    <p class="card-text text-muted mb-2">\${user.email}</p>
                                    <span class="role-badge role-\${user.role}">\${user.role}</span>
                                    <div class="mt-3">
                                        <small class="text-muted">
                                            <i class="fas fa-calendar me-1"></i>
                                            \${new Date(user.createdAt).toLocaleDateString()}
                                        </small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    \`;
                    container.innerHTML += userCard;
                });
                
            } catch (error) {
                console.error('Error loading users:', error);
                document.getElementById('usersContainer').innerHTML = '<div class="col-12"><div class="alert alert-danger">Error loading users</div></div>';
            }
        }

        // Filter users
        function filterUsers() {
            const role = document.getElementById('roleFilter').value;
            const limit = document.getElementById('limitFilter').value;
            loadUsers(role, limit);
        }

        // Refresh users
        function refreshUsers() {
            const role = document.getElementById('roleFilter').value;
            const limit = document.getElementById('limitFilter').value;
            loadUsers(role, limit);
        }

        // Test individual endpoint
        async function testEndpoint(endpoint) {
            try {
                updateRequestCount();
                const response = await fetch(endpoint);
                const data = await response.json();
                
                const responseDiv = document.getElementById('apiResponse');
                responseDiv.innerHTML = \`
                    <div class="text-success mb-2">
                        <i class="fas fa-check-circle me-1"></i>
                        \${endpoint} - Status: \${response.status}
                    </div>
                    <pre><code class="language-json">\${JSON.stringify(data, null, 2)}</code></pre>
                \`;
                
                // Re-highlight code
                if (window.Prism) {
                    Prism.highlightAll();
                }
                
            } catch (error) {
                const responseDiv = document.getElementById('apiResponse');
                responseDiv.innerHTML = \`
                    <div class="text-danger">
                        <i class="fas fa-times-circle me-1"></i>
                        Error testing \${endpoint}: \${error.message}
                    </div>
                \`;
            }
        }

        // Test create user
        async function testCreateUser() {
            try {
                updateRequestCount();
                const testUser = {
                    name: 'Test User ' + Date.now(),
                    email: 'test' + Date.now() + '@example.com',
                    role: 'user'
                };
                
                const response = await fetch('/api/users', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(testUser)
                });
                
                const data = await response.json();
                
                const responseDiv = document.getElementById('apiResponse');
                responseDiv.innerHTML = \`
                    <div class="text-success mb-2">
                        <i class="fas fa-check-circle me-1"></i>
                        POST /api/users - Status: \${response.status}
                    </div>
                    <pre><code class="language-json">\${JSON.stringify(data, null, 2)}</code></pre>
                \`;
                
                // Re-highlight code and refresh users
                if (window.Prism) {
                    Prism.highlightAll();
                }
                loadUsers();
                
            } catch (error) {
                const responseDiv = document.getElementById('apiResponse');
                responseDiv.innerHTML = \`
                    <div class="text-danger">
                        <i class="fas fa-times-circle me-1"></i>
                        Error creating user: \${error.message}
                    </div>
                \`;
            }
        }

        // Test all endpoints
        async function testAllEndpoints() {
            const endpoints = [
                { method: 'GET', url: '/health', name: 'Health Check' },
                { method: 'GET', url: '/api/users', name: 'Get Users' },
                { method: 'GET', url: '/api/users/1', name: 'Get User by ID' },
                { method: 'GET', url: '/api', name: 'API Documentation' }
            ];
            
            let results = [];
            
            for (const endpoint of endpoints) {
                try {
                    updateRequestCount();
                    const response = await fetch(endpoint.url);
                    results.push(\`✅ \${endpoint.name}: \${response.status}\`);
                } catch (error) {
                    results.push(\`❌ \${endpoint.name}: Error\`);
                }
            }
            
            const responseDiv = document.getElementById('apiResponse');
            responseDiv.innerHTML = \`
                <div class="text-info mb-2">
                    <i class="fas fa-info-circle me-1"></i>
                    Endpoint Test Results:
                </div>
                <pre>\${results.join('\\n')}</pre>
            \`;
        }

        // Initialize dashboard
        function initDashboard() {
            loadHealthData();
            loadUsers();
            
            // Auto-refresh every 30 seconds
            setInterval(() => {
                loadHealthData();
            }, 30000);
        }

        // Start dashboard when page loads
        document.addEventListener('DOMContentLoaded', initDashboard);
    </script>
</body>
</html>
  `;
  
  res.send(html);
});

app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    version: '1.0.1',
    environment: process.env.NODE_ENV || 'development'
  };
  
  res.status(200).json(healthCheck);
});

// Enhanced API endpoints
app.get('/api/users', (req, res) => {
  try {
    const { role, limit } = req.query;
    let filteredUsers = users;
    
    // Filter by role if provided
    if (role) {
      filteredUsers = users.filter(user => user.role === role);
    }
    
    // Limit results if provided
    if (limit) {
      const limitNum = parseInt(limit);
      if (limitNum > 0) {
        filteredUsers = filteredUsers.slice(0, limitNum);
      }
    }
    
    res.json({
      success: true,
      count: filteredUsers.length,
      data: filteredUsers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/users', (req, res) => {
  try {
    const { name, email, role = 'user' } = req.body;
    
    // Basic validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required',
        timestamp: new Date().toISOString()
      });
    }
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
        timestamp: new Date().toISOString()
      });
    }
    
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name,
      email,
      role,
      createdAt: new Date().toISOString(),
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0d6efd&color=fff`
    };
    
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      timestamp: new Date().toISOString()
    });
  }
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'CI/CD Docker API',
    version: '1.0.1',
    endpoints: {
      'GET /api/users': 'Get all users (supports ?role=admin|user and ?limit=N)',
      'GET /api/users/:id': 'Get user by ID',
      'POST /api/users': 'Create new user (requires name, email, optional role)'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

const server = app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`👥 Users API: http://localhost:${PORT}/api/users`);
  console.log(`📖 API docs: http://localhost:${PORT}/api`);
  console.log(`🌐 Web Dashboard: http://localhost:${PORT}`);
});

// Graceful shutdown
const gracefulShutdown = (signal) => {
  console.log(`${signal} received, shutting down gracefully`);
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
  
  // Force close after 10 seconds
  setTimeout(() => {
    console.error('Could not close connections in time, forcefully shutting down');
    process.exit(1);
  }, 10000);
};

process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
process.on('SIGINT', () => gracefulShutdown('SIGINT'));

module.exports = app;

app.get('/health', (req, res) => {
  const healthCheck = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    memory: process.memoryUsage(),
    version: '1.0.1',
    environment: process.env.NODE_ENV || 'development'
  };
  
  res.status(200).json(healthCheck);
});

// Enhanced API endpoints
app.get('/api/users', (req, res) => {
  try {
    const { role, limit } = req.query;
    let filteredUsers = users;
    
    // Filter by role if provided
    if (role) {
      filteredUsers = users.filter(user => user.role === role);
    }
    
    // Limit results if provided
    if (limit) {
      const limitNum = parseInt(limit);
      if (limitNum > 0) {
        filteredUsers = filteredUsers.slice(0, limitNum);
      }
    }
    
    res.json({
      success: true,
      count: filteredUsers.length,
      data: filteredUsers,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch users',
      timestamp: new Date().toISOString()
    });
  }
});

app.get('/api/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id);
    const user = users.find(u => u.id === userId);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
        timestamp: new Date().toISOString()
      });
    }
    
    res.json({
      success: true,
      data: user,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error fetching user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch user',
      timestamp: new Date().toISOString()
    });
  }
});

app.post('/api/users', (req, res) => {
  try {
    const { name, email, role = 'user' } = req.body;
    
    // Basic validation
    if (!name || !email) {
      return res.status(400).json({
        success: false,
        error: 'Name and email are required',
        timestamp: new Date().toISOString()
      });
    }
    
    // Check if email already exists
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: 'User with this email already exists',
        timestamp: new Date().toISOString()
      });
    }
    
    const newUser = {
      id: Math.max(...users.map(u => u.id)) + 1,
      name,
      email,
      role,
      createdAt: new Date().toISOString()
    };
    
    users.push(newUser);
    
    res.status(201).json({
      success: true,
      data: newUser,
      message: 'User created successfully',
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to create user',
      timestamp: new Date().toISOString()
    });
  }
});

// API info endpoint
app.get('/api', (req, res) => {
  res.json({
    name: 'CI/CD Docker API',
    version: '1.0.1',
    endpoints: {
      'GET /api/users': 'Get all users (supports ?role=admin|user and ?limit=N)',
      'GET /api/users/:id': 'Get user by ID',
      'POST /api/users': 'Create new user (requires name, email, optional role)'
    },
    timestamp: new Date().toISOString()
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err.stack);
  res.status(500).json({ 
    success: false,
    error: 'Something went wrong!',
    timestamp: new Date().toISOString()
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ 
    success: false,
    error: 'Route not found',
    path: req.originalUrl,
    timestamp: new Date().toISOString()
  });
});

