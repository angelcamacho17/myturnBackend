const express = require('express');
const users = express.Router();
const cors = require('cors');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const Joi = require('joi');

const User = require("../models/User")
users.use(cors())

process.env.SECRET_KEY = "secret"

users.post('/register', async (req, res) => {
    const today = new Date();
    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);
    console.log(req.body);
    const userData = {
        name: req.body.name,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        date: req.body.date
    }
    
    User.findOne({
        email:req.body.email
    })
    .then(user => {
        if (!user){
            bcrypt.hash(req.body.password, 10, (err, hash) =>{
                userData.password = hash,
                User.create(userData)
                .then(user=>{
                    res.json({status: user.email + ' registered!!!'})
                })
                .catch(err => {
                    res.send('error: '+ err )
                })
            })
        }else{
            res.json({error: 'User already exist'})
        }
    })
    .catch(err => {
        res.send('error '+ err)
    })
  });

users.post('/login', async (req, res) => {

    User.findOne({
        email:req.body.email
    })
    .then(user => {
        if (user){
            if(bcrypt.compareSync(req.body.password, user.password)){
                const payload = {
                  _id: user._id,
                  name: user.name,
                  lastName: user.lastName,
                  email: user.email
                }
                let token = jwt.sign(payload, process.env.SECRET_KEY,{
                  expiresIn:1440
                })
                res.header('x-auth-token', token)
                res.send(token)
            }else{
              res.json({error: 'wrong password'})
            }
        }else{
          res.json({error: 'User does not exist'})
        }
    })
    .catch(err => {
        res.send('error '+ err)
    })
  });

users.get('/profile', async (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process. env.SECRET_KEY)

    const { error } = validateUser(req.body); 
    if (error) return res.status(400).send(error.details[0].message);

    User.findOne({
      _id: decoded._id
    })
    .then(user => {
      if (user){
        res.json(user)
      }
      else{
        res.send("the user does not exist")
      }
    })
    .catch(err =>{
      res.send('error: '+ err)
    })
});
  
function validateUser(user) {
    const schema = {
      name: Joi.string().min(3).max(50).required(),
      lastName: Joi.string().min(3).max(50).required(),
      email: Joi.string().min(5).max(255).required().email( ),
      password: Joi.string().min(5).max(255).required()
    };
  
    return Joi.validate(user, schema);
  }
  

module.exports = users