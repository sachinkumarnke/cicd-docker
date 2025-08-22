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
    <title>CI/CD Docker App - Dashboard</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
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
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: 'Inter', sans-serif;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
            color: #333;
        }

        .dashboard-container {
            min-height: 100vh;
            padding: 2rem 0;
        }

        .glass-card {
            background: rgba(255, 255, 255, 0.95);
            backdrop-filter: blur(10px);
            border-radius: 20px;
            border: 1px solid rgba(255, 255, 255, 0.2);
            box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
            transition: all 0.3s ease;
        }

        .glass-card:hover {
            transform: translateY(-5px);
            box-shadow: 0 12px 40px rgba(0, 0, 0, 0.15);
        }

        .header-card {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            border: none;
        }

        .stat-card {
            text-align: center;
            padding: 2rem;
            height: 100%;
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
        }

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

        .user-card {
            transition: all 0.3s ease;
            border: none;
            border-radius: 15px;
            overflow: hidden;
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

        .api-endpoint {
            background: rgba(108, 117, 125, 0.05);
            border-radius: 10px;
            padding: 1rem;
            margin-bottom: 1rem;
            border-left: 4px solid var(--primary-color);
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

        .btn-custom {
            border-radius: 50px;
            padding: 0.75rem 2rem;
            font-weight: 500;
            text-transform: uppercase;
            letter-spacing: 1px;
            transition: all 0.3s ease;
        }

        .btn-custom:hover {
            transform: translateY(-2px);
            box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
        }

        .section-title {
            font-size: 1.5rem;
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
            background: linear-gradient(135deg, var(--primary-color), var(--info-color));
            border-radius: 2px;
        }

        @media (max-width: 768px) {
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
        }
    </style>
</head>
<body>
    <div class="dashboard-container">
        <div class="container">
            <!-- Header -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="glass-card header-card p-4 text-center fade-in">
                        <h1 class="display-4 fw-bold mb-2">
                            <i class="fas fa-rocket me-3"></i>
                            CI/CD Docker App
                        </h1>
                        <p class="lead mb-3">Modern DevOps Dashboard with Real-time Monitoring</p>
                        <div class="d-flex justify-content-center align-items-center gap-3 flex-wrap">
                            <span class="badge bg-light text-dark px-3 py-2">
                                <i class="fas fa-code-branch me-2"></i>Version 1.0.1
                            </span>
                            <span class="badge bg-light text-dark px-3 py-2">
                                <i class="fas fa-server me-2"></i>Node.js
                            </span>
                            <span class="badge bg-light text-dark px-3 py-2">
                                <i class="fab fa-docker me-2"></i>Docker
                            </span>
                        </div>
                    </div>
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

            <!-- API Endpoints -->
            <div class="row mb-4">
                <div class="col-12">
                    <div class="glass-card p-4 fade-in" style="animation-delay: 0.7s">
                        <h3 class="section-title">
                            <i class="fas fa-code me-2"></i>
                            API Endpoints
                        </h3>
                        <div class="row">
                            <div class="col-md-6">
                                <div class="api-endpoint">
                                    <span class="method-badge method-get">GET</span>
                                    <code>/health</code>
                                    <p class="mb-0 mt-2 text-muted">System health check</p>
                                </div>
                                <div class="api-endpoint">
                                    <span class="method-badge method-get">GET</span>
                                    <code>/api/users</code>
                                    <p class="mb-0 mt-2 text-muted">Get all users with filtering</p>
                                </div>
                                <div class="api-endpoint">
                                    <span class="method-badge method-get">GET</span>
                                    <code>/api/users/:id</code>
                                    <p class="mb-0 mt-2 text-muted">Get user by ID</p>
                                </div>
                            </div>
                            <div class="col-md-6">
                                <div class="api-endpoint">
                                    <span class="method-badge method-post">POST</span>
                                    <code>/api/users</code>
                                    <p class="mb-0 mt-2 text-muted">Create new user</p>
                                </div>
                                <div class="api-endpoint">
                                    <span class="method-badge method-get">GET</span>
                                    <code>/api</code>
                                    <p class="mb-0 mt-2 text-muted">API documentation</p>
                                </div>
                            </div>
                        </div>
                        <div class="text-center mt-4">
                            <button class="btn btn-outline-primary btn-custom" onclick="testAllEndpoints()">
                                <i class="fas fa-play me-2"></i>Test All Endpoints
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>
    <script>
        let requestCount = 0;

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
            
            alert('Endpoint Test Results:\\n\\n' + results.join('\\n'));
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

