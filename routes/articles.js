'use strict'
var express = require('express');
var router = express.Router();
var Article = require('../models/article')

router.get('/', function(req, res) {
  Article.find({})
  .then((articles)=>{
    res.send(articles)
  })
  .catch((err)=>{res.send(err)})
});

router.post('/', function(req, res) {
  Article.create({})
  .then(()=>{
    res.send('Article added')
  })
  .catch((err)=>{res.send(err)})
});

router.delete('/:id', function(req, res) {
  let id = req.params.id
  Article.deleteOne({_id: id})
  .then(()=>{
    res.send('Article removed')
  })
  .catch((err)=>{res.send(err)})
});

module.exports = router;
