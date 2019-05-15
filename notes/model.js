'use strict';
const mongoose = require('mongoose');
const {Exercise} = require('../exercises/model');

mongoose.Promise = global.Promise;

const noteSchema = mongoose.Schema({
  content: {
    type: String,
    required: true
  },
  exercise: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Exercise'
  }
});

noteSchema.pre('findOne', function(next) {
  this.populate('exercise');
  next();
});

const Note = mongoose.model('Note', noteSchema);

module.exports = {Note};