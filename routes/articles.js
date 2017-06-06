'use strict'
var express = require('express');
var router = express.Router();
var article = require('../controllers/articleController')

router.get('/', article.getAll);

router.get('/:id', article.getByID);

router.post('/', article.create);

router.delete('/:id', article.delete);

router.put('/:id', article.update)

module.exports = router;
