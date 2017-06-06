'use strict'
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);
var should = chai.should();

require('dotenv').config();
const saltRounds = 10;
var bcrypt = require('bcrypt');

const server = require('../app');
const User = require('../models/user');

describe('User API test', () => {

  afterEach(done => {
    User.remove({}, (err) => {
      done();
    })
  })

  describe('GET api/users', () => {
    beforeEach(done => {
      var newUser = new User({
        username: "John Doe",
        password: "12345",
        email: "johndoe@gmail.com",
        createdAt: new Date()
      })
      newUser.save((err, result) => {})
      done()
    });

    it('should get all users', done => {
      chai.request(server)
      .get('/api/users')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equal(1);
        done()
      })

    })
  })

  describe('POST api/users/signup', () => {
    beforeEach(done => {
      var newUser = new User({
        username: "John Doe test",
        password: "12345",
        email: "johndoe.test@gmail.com",
        createdAt: new Date()
      })
      newUser.save((err, result) => {
        done()
      })
    });

    it('should create a user', (done) => {
      chai.request(server)
      .post('/api/users/signup')
      .send({
        username: "John Doe",
        password: "12345",
        email: "johndoe@gmail.com",
        createdAt: new Date()
      })
      .end((err,res) => {
        res.should.have.a.status(200)
        res.body.should.be.a('object')
        res.body.should.have.property('username', 'John Doe')
        res.body.should.have.property('email', 'johndoe@gmail.com')
        done();
      })
    });

    it('should show error that username is already taken', (done) => {
      chai.request(server)
      .post('/api/users/signup')
      .send({
        username: "John Doe test",
        password: "12345",
        email: "johndoe.new@gmail.com",
        createdAt: new Date()
      })
      .end((err,res) => {
        res.should.have.a.status(200)
        res.body.should.be.a('object')
        res.text.should.equal('username already taken')
        done();
      })
    });

    it('should show error that email is already used', (done) => {
      chai.request(server)
      .post('/api/users/signup')
      .send({
        username: "John Doe",
        password: "12345",
        email: "johndoe.test@gmail.com",
        createdAt: new Date()
      })
      .end((err,res) => {
        res.should.have.a.status(200)
        res.body.should.be.a('object')
        res.text.should.equal('email is already registered')
        done();
      })
    });

    it('should show error please enter your email', (done) => {
      chai.request(server)
      .post('/api/users/signup')
      .send({
        username: "John Doe",
        password: "12345",
        createdAt: new Date()
      })
      .end((err,res) => {
        res.should.have.a.status(200)
        res.body.should.have.property('errors')
        done();
      })
    });

    it('should show error please enter your username', (done) => {
      chai.request(server)
      .post('/api/users/signup')
      .send({
        password: "12345",
        email: "johndoe.test@gmail.com",
        createdAt: new Date()
      })
      .end((err,res) => {
        res.should.have.a.status(200)
        res.body.should.have.property('errors')
        done();
      })
    });
  });

  describe('POST api/users/login', () => {
    beforeEach(done => {
      var salt = bcrypt.genSaltSync(saltRounds);
      var hash = bcrypt.hashSync("12345", salt);

      var newUser = new User({
        username: "John Doe",
        password: hash,
        email: "johndoe@gmail.com",
        createdAt: new Date()
      })
      newUser.save((err, result) => {})
      done()
    });

    it('should send user token', done => {
      chai.request(server)
      .post('/api/users/login')
      .send({
        username: "John Doe",
        password: "12345"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('token')
        // res.text.should.equal('password is incorrect');
        done()
      })
    })

    it('should send error that password is incorrect', done => {
      chai.request(server)
      .post('/api/users/login')
      .send({
        username: "John Doe",
        password: "1234"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.text.should.equal('password is incorrect');
        done()
      })
    })

    it('should send error that there is no user with that username', done => {
      chai.request(server)
      .post('/api/users/login')
      .send({
        username: "John Doeer",
        password: "1234"
      })
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('object');
        res.text.should.equal('no such user');
        done()
      })
    })
  })

  describe('DELETE api/users/:id', () => {
    var target
    beforeEach(done => {
      var newUser = new User({
        username: "John Doe",
        password: "12345",
        email: "johndoe@gmail.com",
        createdAt: new Date()
      })
      newUser.save((err, result) => {
        target = result._id
        done()
      })
    });

    it('should remove a user', (done) => {
      chai.request(server)
      .delete(`/api/users/${target}`)
      .end((err,res) => {
        res.should.have.a.status(200)
        res.body.should.be.a('object')
        res.text.should.equal('user has been deleted')
        done();
      })
    });
  });

  describe('GET api/users/:id', () => {
    var target
    beforeEach(done => {
      var newUser = new User({
        username: "John Doe",
        password: "12345",
        email: "johndoe@gmail.com",
        createdAt: new Date()
      })
      newUser.save((err, result) => {
        target = result._id
        done()
      })
    });

    it('should return user with id', (done) => {
      chai.request(server)
      .get(`/api/users/${target}`)
      .end((err, res) => {
        res.should.have.a.status(200)
        res.should.be.a('object')
        res.body.should.have.property('username', 'John Doe')
        res.body.should.have.property('email', 'johndoe@gmail.com')
        done();
      })
    })
  })

  describe('PUT api/users/:id', () => {
    var target
    beforeEach(done => {
      var newUser = new User({
        username: "John Doe",
        password: "12345",
        email: "johndoe@gmail.com",
        createdAt: new Date()
      })
      newUser.save((err, result) => {
        target = result._id
        done()
      })
    });

    it('should update user with id', (done) => {
      chai.request(server)
      .put(`/api/users/${target}`)
      .send({
        username: "John Doe edit",
        email: "johndoe.edit@gmail.com"
      })
      .end((err, res) => {
        res.should.have.a.status(200)
        res.should.be.a('object')
        res.body.should.have.property('username', 'John Doe edit')
        res.body.should.have.property('email', 'johndoe.edit@gmail.com')
        done();
      })
    })
  })
})
