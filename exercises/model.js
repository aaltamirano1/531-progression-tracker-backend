'use strict';
const mongoose = require('mongoose');
const {User} = require('../users/model');
const {noteSchema} = require('../notes/model');

mongoose.Promise = global.Promise;

const exerciseSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  orm: {
    type: Number,
    required: true
  },
  week: {
    type: Number,
    required: false,
    default: 1
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

exerciseSchema.pre('findOne', function(next) {
  this.populate('user');
  next();
});

exerciseSchema.virtual('username').get(function(){
  return this.user.username;
});

const Exercise = mongoose.model('Exercise', exerciseSchema);

module.exports = {Exercise};