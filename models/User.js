const Joi = require('joi');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  lastName: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024,
    unique: true
  },
  date:{
    type: Date,
    default: Date.now
  }
})

module.exports = User = mongoose.model('users', UserSchema);