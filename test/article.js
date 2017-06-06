'use strict'
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

var should = chai.should();

const server = require('../app');
const Article = require('../models/article');

describe('Article API test', () => {

  afterEach(done => {
    Article.remove({}, (err) => {
      done();
    })
  })

  describe('GET api/articles', () => {
    beforeEach(done => {
      var newArticle = new Article({
        title: "Hello World",
        author: "Jhon Doe",
        content: "Lorem Ipsum Dolor sit Amet",
        createdAt: new Date()
      })
      newArticle.save((err, result) => {})
      done()
    });

    it('should get all artcile', done => {
      chai.request(server)
      .get('/api/articles')
      .end((err, res) => {
        res.should.have.status(200);
        res.body.should.be.a('array');
        res.body.length.should.equal(1);
        done()
      })

    })
  })

  describe('POST api/articles', () => {
    it('should create a article', (done) => {
      chai.request(server)
      .post('/api/articles')
      .send({
        title: "Hello World",
        author: "Jhon Doe",
        content: "Lorem Ipsum Dolor sit Amet",
        createdAt: new Date()
      })
      .end((err,res) => {
        res.should.have.a.status(200)
        res.body.should.be.a('object')
        res.text.should.equal('Article added')
        done();
      })
    });
  });

  describe('DELETE api/articles/:id', () => {
    var target
    beforeEach(done => {
      var newArticle = new Article({
        title: "Hello World",
        author: "Jhon Doe",
        content: "Lorem Ipsum Dolor sit Amet",
        createdAt: new Date()
      })
      newArticle.save((err, result) => {
        target = result._id
        done()
      })
    });

    it('should remove a article', (done) => {
      chai.request(server)
      .delete(`/api/articles/${target}`)
      .end((err,res) => {
        res.should.have.a.status(200)
        res.body.should.be.a('object')
        res.text.should.equal('Article removed')
        done();
      })
    });
  });

  describe('GET api/articles/:id', () => {
    var target
    beforeEach(done => {
      var newArticle = new Article({
        title: "Hello World",
        author: "Jhon Doe",
        content: "Lorem Ipsum Dolor sit Amet",
        createdAt: new Date()
      })
      newArticle.save((err, result) => {
        target = result._id
        done()
      })
    });

    it('should return article with id', (done) => {
      chai.request(server)
      .get(`/api/articles/${target}`)
      .end((err, res) => {
        res.should.have.a.status(200)
        res.should.be.a('object')
        res.body.should.have.property("title", 'Hello World')
        res.body.should.have.property('author', 'Jhon Doe')
        res.body.should.have.property('content', 'Lorem Ipsum Dolor sit Amet')
        done();
      })
    })
  })

  describe('PUT api/articles/:id', () => {
    var target
    beforeEach(done => {
      var newArticle = new Article({
        title: "Hello World",
        author: "Jhon Doe",
        content: "Lorem Ipsum Dolor sit Amet",
        createdAt: new Date()
      })
      newArticle.save((err, result) => {
        target = result._id
        done()
      })
    });

    it('should update article with id', (done) => {
      chai.request(server)
      .put(`/api/articles/${target}`)
      .send({
        title: "Hello World Web",
        author: "Jhon Doe Foo",
        content: "Empty Lorem Ipsum Dolor sit Amet"
      })
      .end((err, res) => {
        res.should.have.a.status(200)
        res.should.be.a('object')
        res.body.should.have.property('title', 'Hello World Web')
        res.body.should.have.property('author', 'Jhon Doe Foo')
        res.body.should.have.property('content', 'Empty Lorem Ipsum Dolor sit Amet')
        done();
      })
    })
  })
})
