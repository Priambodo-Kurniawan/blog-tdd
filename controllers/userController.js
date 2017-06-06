require('dotenv').config();
const saltRounds = 10;

var User = require('../models/user');
var bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const secret = process.env.TOKEN_SECRET;
var methods = {}

methods.findAll = (req, res) => {
  User.find({})
  .then((users)=>{
    res.send(users)
  })
  .catch(err => console.log(err))
}

methods.signup = (req, res) => {
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(req.body.password, salt);

  User.create({
    username: req.body.username,
    password: hash,
    email: req.body.email,
    createdAt: new Date()
  })
  .then(response => {
    User.findById(response._id)
    .then(user => {
      res.send(user)
    })
  })
  .catch(err => {
    // console.log(err.message);
    if(/username_1/.test(err.message)){
      res.send('username already taken')
    }
    else if(/email_1/.test(err.message)){
      res.send('email is already registered')
    }
    else {
      res.send(err)
    }
  })
}

methods.login = (req, res) => {
  var username = req.body.username;
  var password = req.body.password;

  User.findOne({username: username})
  .then(user => {
    if(user == null){
      res.send('no such user')
    } else {
      bcrypt.compare(password, user.password)
      .then(result => {
        if(result) {
          var token = jwt.sign({id: user.id, email: user.email, username: user.username}, secret);
          res.send({'token': token});
        } else {
          res.send("password is incorrect");
        }
      })
      .catch(err => console.log(err))
    }
  })
  .catch(err => console.log(err))
}

methods.getOne = (req, res) => {
  User.findById(req.params.id)
  .then(user => {
    res.send(user)
  })
  .catch(err => console.log(err))
}

methods.update = (req, res) => {
  if(req.body.password){
    var salt = bcrypt.genSaltSync(saltRounds);
    var hash = bcrypt.hashSync(req.body.password, salt);
    req.body.password = hash
  }
  User.findByIdAndUpdate(req.params.id, { $set: req.body }, { runValidators: true }, (err, user) => {
    if(err) res.send(err.errors)
    else {
      User.findById(req.params.id)
      .then(user => {
        res.send(user)
      })
      .catch(err => console.log(err))
    }
  })
}

methods.remove = (req, res) => {
  User.findOneAndRemove({_id: req.params.id})
  .then (() => {
    res.send('user has been deleted')
  })
  .catch(err => console.log(err))
}

module.exports = methods
