import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js'
import User from '../models/User.js';
import Blog from '../models/Blog.js';
import dotenv from 'dotenv';

dotenv.config();

chai.use(chaiHttp);
chai.should();


  describe('POST /auth/register', function () {
    it('should register a new user', async () => {
      const user = { email: 'test1111111@example.com', password: '11111111password123' };
      let userExists = false;
      if (await User.findOne({email: user.email})) {
        userExists = true;
        await User.findOneAndDelete({ email: user.email });
      };

      const res = await chai.request(app).post('/auth/register').send(user);
      res.should.have.status(200);
      res.body.should.have.property('token');
    });
  });

  describe('POST /auth/login', function () {
    it('should log the user in and return a JWT token', async () => {
      const user = { email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD };

      const res = await chai.request(app).post('/auth/login').send(user);
      res.should.have.status(200);
      res.body.should.have.property('token');
    });
  });

  describe('GET /public/blogs', function () {
    it('should get all public blog posts', async () => {

      const res = await chai.request(app).get('/public/blogs');
      res.should.have.status(200);
      res.body.should.be.an('array');
    });
  });

  describe('POST /admin/blogs', function () {
    let token: any;
    
    beforeEach(async () => {
      const loginRes = await chai.request(app)
        .post('/auth/login')
        .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
      token = loginRes.body.token;
    });

    it('should create a new blog post', async () => {
      const res = await chai.request(app)
        .post('/admin/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New Blog', content: 'Blog content', author: 'admin' });

      res.should.have.status(201);
      res.body.should.have.property('title').eql('New Blog');
    });
  });

