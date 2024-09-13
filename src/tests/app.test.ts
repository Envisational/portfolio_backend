import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../server.js'
import User from '../models/User.js';
import Blog from '../models/Blog.js';
import dotenv from 'dotenv';

dotenv.config();

chai.use(chaiHttp);
chai.should();

// Register 
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

  // Fetch all blogs
  describe('GET /public/blogs', function () {
    it('should get all public blog posts', async () => {

      const res = await chai.request(app).get('/public/blogs');
      res.should.have.status(200);
      res.body.should.be.an('array');
    });
  });

  // Admin route for blogs (login, create, update, delete)
  describe('Admin route for blogs (login, create, update, delete)', function () {
    let token: string;
    let blogId: string;
  
    // Login to get the token before running any tests
    beforeEach(async () => {
      const loginRes = await chai.request(app)
        .post('/auth/login')
        .send({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD });
      token = loginRes.body.token;
    });
  
    it('should create, update, and delete a blog post', async () => {
      // 1. Create a new blog post
      const createRes = await chai.request(app)
        .post('/admin/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'New Blog', content: 'Blog content', author: 'admin' });
  
      createRes.should.have.status(201);
      createRes.body.should.have.property('Blog saved');
      blogId = createRes.body['Blog saved']._id;  // Get the blog's ID from the creation response

  
      // 2. Update the blog post using the retrieved ID
      const updateRes = await chai.request(app)
        .put(`/admin/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Updated Blog', content: 'Updated content' });
  
      updateRes.should.have.status(200);
      updateRes.body.should.have.property('blog updated');
      updateRes.body['blog updated'].should.have.property('title').eql('Updated Blog');
      updateRes.body['blog updated'].should.have.property('content').eql('Updated content');
  
      // 3. Delete the blog post using the same ID
      const deleteRes = await chai.request(app)
        .delete(`/admin/blogs/${blogId}`)
        .set('Authorization', `Bearer ${token}`);
  
      deleteRes.should.have.status(200);
 
      deleteRes.body.should.have.property('message').eql('Blog deleted');
  
      // 4. Verify the blog post is actually deleted
      const deletedBlog = await Blog.findById(blogId);
      deletedBlog?.should.be.null;
    });
  });