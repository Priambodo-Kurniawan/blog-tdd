var express = require('express');
var router = express.Router();
var user = require('../controllers/userController')

router.get('/', user.findAll)

router.post('/signup', user.signup)

router.post('/login', user.login);

router.delete('/:id', user.remove)

router.put('/:id', user.update)

router.get('/:id', user.getOne)

module.exports = router;
