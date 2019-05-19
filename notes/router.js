'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const passport = require('passport');
const {Note} = require('./model');
const {Exercise} = require('../exercises/model');
const jwtAuth = passport.authenticate('jwt', { session: false });
const router = express.Router();

const jsonParser = bodyParser.json();

router.post('/', jwtAuth, jsonParser, (req, res)=>{
  if(!('content' in req.body)){
    const msg = `Missing "content" in request body.`;
    console.error(msg);
    return res.status(400).send(msg);
  }

  Note
    .create({
      content: req.body.content,
      exercise: req.body.exercise_id
    })
    .then(post=>res.status(201).json())
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error when adding new note." });
    });      
});

router.put('/:id', jwtAuth, jsonParser, (req, res)=>{
  const toUpdate = {};
  if('content' in req.body){
    toUpdate['content'] = req.body['content'];
  }

  Note
    .findOneAndUpdate({_id: req.params.id}, {$set: toUpdate})
    .then(updatedNote=>{
      console.log(`Updated note with id ${req.params.id}.`);
      res.status(200).json({content: toUpdate.content});
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error with updating note." });
    });
});

router.get('/by-exercise/:exercise_id', (req, res) => {
  return Note.find({exercise: req.params.exercise_id})
    .then(notes => {
      res.json(notes);
    })
    .catch(err => res.status(500).json({message: 'Internal server error when getting notes by execises id.'}));
});

router.get('/:id', (req, res) => {
  return Note.findById(req.params.id)
    .then(notes => {
      res.json(notes);
    })
    .catch(err => res.status(500).json({message: 'Internal server error when getting note by id.'}));
});

router.delete('/:id', jwtAuth, (req, res)=>{
  Note.findByIdAndRemove(req.params.id)
    .then(()=>{
      console.log(`Deleted note with id ${req.params.id}.`);
      res.status(204).end();
    })
    .catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error when deleting note." });
    });
});

module.exports = {router};