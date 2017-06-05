'use strict'
const chai = require('chai');
const chaiHttp = require('chai-http');
chai.use(chaiHttp);

var should = chai.should();

const server = require('../app');
const Article = require('../models/article');

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

  afterEach(done => {
    Article.remove({}, (err) => {
      done();
    })
  })

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
  afterEach(done => {
    Article.remove({}, (err) => {
      done();
    })
  })

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

describe('DELETE api/articles', () => {
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

  afterEach(done => {
    Article.remove({}, (err) => {
      done();
    })
  })

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
