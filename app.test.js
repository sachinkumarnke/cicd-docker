const request = require('supertest');
const app = require('./app');

describe('CI/CD Docker App', () => {
  describe('GET /', () => {
    it('should return web dashboard HTML', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.type).toBe('text/html');
      expect(response.text).toContain('CI/CD Docker App - Dashboard');
      expect(response.text).toContain('Modern DevOps Dashboard');
      expect(response.text).toContain('System Health');
      expect(response.text).toContain('User Management');
      expect(response.text).toContain('API Endpoints');
    });

    it('should include Bootstrap and FontAwesome in web dashboard', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.text).toContain('bootstrap@5.3.0');
      expect(response.text).toContain('font-awesome');
    });

    it('should include JavaScript functionality', async () => {
      const response = await request(app).get('/');
      
      expect(response.status).toBe(200);
      expect(response.text).toContain('loadHealthData');
      expect(response.text).toContain('loadUsers');
      expect(response.text).toContain('testAllEndpoints');
    });
  });

  describe('GET /health', () => {
    it('should return comprehensive health status', async () => {
      const response = await request(app).get('/health');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('status', 'healthy');
      expect(response.body).toHaveProperty('uptime');
      expect(response.body).toHaveProperty('timestamp');
      expect(response.body).toHaveProperty('memory');
      expect(response.body).toHaveProperty('version', '1.0.1');
    });
  });

  describe('GET /api', () => {
    it('should return API documentation', async () => {
      const response = await request(app).get('/api');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('name', 'CI/CD Docker API');
      expect(response.body).toHaveProperty('version', '1.0.1');
      expect(response.body).toHaveProperty('endpoints');
    });
  });

  describe('GET /api/users', () => {
    it('should return list of users with metadata', async () => {
      const response = await request(app).get('/api/users');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('count');
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
      expect(response.body.data.length).toBeGreaterThan(0);
      expect(response.body.data[0]).toHaveProperty('id');
      expect(response.body.data[0]).toHaveProperty('name');
      expect(response.body.data[0]).toHaveProperty('email');
      expect(response.body.data[0]).toHaveProperty('role');
      expect(response.body.data[0]).toHaveProperty('avatar');
    });

    it('should filter users by role', async () => {
      const response = await request(app).get('/api/users?role=admin');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data.every(user => user.role === 'admin')).toBe(true);
    });

    it('should limit number of users returned', async () => {
      const response = await request(app).get('/api/users?limit=1');
      
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
    });
  });

  describe('GET /api/users/:id', () => {
    it('should return specific user by ID', async () => {
      const response = await request(app).get('/api/users/1');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('id', 1);
      expect(response.body.data).toHaveProperty('avatar');
    });

    it('should return 404 for non-existent user', async () => {
      const response = await request(app).get('/api/users/999');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'User not found');
    });
  });

  describe('POST /api/users', () => {
    it('should create a new user with avatar', async () => {
      const newUser = {
        name: 'Test User',
        email: 'test@example.com',
        role: 'user'
      };

      const response = await request(app)
        .post('/api/users')
        .send(newUser);
      
      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data).toHaveProperty('name', newUser.name);
      expect(response.body.data).toHaveProperty('email', newUser.email);
      expect(response.body.data).toHaveProperty('id');
      expect(response.body.data).toHaveProperty('avatar');
      expect(response.body.data.avatar).toContain('ui-avatars.com');
    });

    it('should return 400 for missing required fields', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({ name: 'Test User' }); // missing email
      
      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Name and email are required');
    });

    it('should return 409 for duplicate email', async () => {
      const response = await request(app)
        .post('/api/users')
        .send({
          name: 'Duplicate User',
          email: 'john@example.com' // existing email
        });
      
      expect(response.status).toBe(409);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'User with this email already exists');
    });
  });

  describe('GET /nonexistent', () => {
    it('should return 404 for non-existent routes', async () => {
      const response = await request(app).get('/nonexistent');
      
      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error', 'Route not found');
    });
  });
});

// Close any open handles after tests
afterAll((done) => {
  done();
});
