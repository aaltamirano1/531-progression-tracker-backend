'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const {Exercise} = require('./model');
const {User} = require('../users/model');
const jwtAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();

const jsonParser = bodyParser.json();

// reqs jwt sign to test
router.post('/', jwtAuth, jsonParser, (req, res)=>{
  const requiredFields = ['name', 'orm'];
  requiredFields.forEach(field => {
    if(!(field in req.body)){
      const msg = `Missing ${field} in request body.`;
      console.error(msg);
      return res.status(400).send(msg);
    }
  });
  Exercise
    .create({
      name: req.body.name,
      orm: req.body.orm,
      user: req.user.id
    })
    .then(post=>res.status(201).json())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error when adding new exercise." });
    });        

});

router.put('/:id', jwtAuth, jsonParser, (req, res)=>{
  const toUpdate = {};
  const updatableFields = ['name', 'orm', 'week'];
  updatableFields.forEach(field=>{
    if(field in req.body){
      toUpdate[field] = req.body[field];
    }
  });

  Exercise
    .findOneAndUpdate({_id: req.params.id}, {$set: toUpdate})
    .then(updatedExercise=>{
      console.log(`Updated item with id ${req.params.id}.`);
      res.status(200).json({
        name: toUpdate.name,
        orm: toUpdate.orm,
        week: toUpdate.week
      });
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error with updating exercise." });
    });
});

router.get('/by-user/:user_id', (req, res) => {
  return Exercise.find({user: req.params.user_id}).sort({ date: -1 })
    .then(execises => {
      res.json(execises);
    })
    .catch(err => res.status(500).json({message: 'Internal server error when getting execises by user id.'}));
});

router.get('/:id', (req, res) => {
  return Exercise.findById(req.params.id)
    .then(execises => {
      res.json(execises);
    })
    .catch(err => res.status(500).json({message: 'Internal server error when getting exercise by id.'}));
});

router.delete('/:id', jwtAuth, (req, res)=>{
  Exercise.findByIdAndRemove(req.params.id)
    .then(()=>{
      console.log(`Deleted exercise with id ${req.params.id}.`);
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error when deleting exercise." });
    });
});

module.exports = {router};