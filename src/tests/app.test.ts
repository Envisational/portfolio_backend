import chai from 'chai';
import chaiHttp from 'chai-http';
import server from '../server.js'
import User from '../models/User.js';
import Blog from '../models/Blog.js';
chai.use(chaiHttp);
const { expect } = chai;

describe('Auth and Blog Routes', () => {
  
  beforeEach(async function () {
    this.timeout(5000); // Allow enough time for async operations
    await User.deleteMany({});
    await Blog.deleteMany({});
  });

  describe('POST /auth/register', () => {
    it('should register a new user', async () => {
      const user = { email: 'test@example.com', password: 'password123' };
      const res = await chai.request(server).post('/api/auth/register').send(user);
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
    });
  });

  describe('POST /auth/login', () => {
    it('should log the user in and return a JWT token', async () => {
      const user = new User({ email: 'test@example.com', password: 'password123' });
      await user.save();

      const res = await chai.request(server).post('/api/auth/login').send({ email: 'test@example.com', password: 'password123' });
      expect(res).to.have.status(200);
      expect(res.body).to.have.property('token');
    });
  });

  describe('GET /api/blogs/public', () => {
    it('should get all public blog posts', async () => {
      const blog = new Blog({ title: 'Test Blog', content: 'Test content', author: 'admin' });
      await blog.save();

      const res = await chai.request(server).get('/api/blogs/public');
      expect(res).to.have.status(200);
      expect(res.body).to.be.an('array');
      expect(res.body.length).to.equal(1);
    });
  });

  describe('POST /admin/blogs', () => {
    let token: any;
    
    beforeEach(async () => {
      const loginRes = await chai.request(server)
        .post('/api/auth/login')
        .send({ email: 'admin@example.com', password: 'password123' });
      token = loginRes.body.token;
    });

    it('should create a new blog post', async () => {
      const res = await chai.request(server)
        .post('/admin/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New Blog', content: 'Blog content', author: 'admin' });

      expect(res).to.have.status(201);
      expect(res.body).to.have.property('title').eql('New Blog');
    });
  });

});
