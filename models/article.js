'use strict'
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var artcileSchema = new Schema({
  title: String,
  author: String,
  content: String,
  createdAt: Date
})

var Article = mongoose.model('Article', artcileSchema);

module.exports = Article;
