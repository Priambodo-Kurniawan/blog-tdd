var Article = require('../models/article')
var methods = {}

methods.getAll = (req, res) => {
  Article.find({})
  .then((articles)=>{
    res.send(articles)
  })
  .catch((err)=>{res.send(err)})
}

methods.getByID = (req, res) => {
  Article.findById(req.params.id)
  .then((article)=>{
    res.send(article)
  })
  .catch((err)=>{res.send(err)})
}

methods.create = (req, res) => {
  Article.create({})
  .then(()=>{
    res.send('Article added')
  })
  .catch((err)=>{res.send(err)})
}

methods.update = (req, res) => {
  let id = req.params.id
  Article.update({_id: id}, req.body)
  .then(() => {
    Article.findById(id)
    .then((article)=>{
      res.send(article)
    })
    .catch((err)=>{res.send(err)})
  })
  .catch((err)=>{res.send(err)})
}

methods.delete = (req, res) => {
  let id = req.params.id
  Article.deleteOne({_id: id})
  .then(()=>{
    res.send('Article removed')
  })
  .catch((err)=>{res.send(err)})
}

module.exports = methods
