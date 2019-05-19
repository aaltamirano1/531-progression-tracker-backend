const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const {app, runServer, closeServer} = require("../server");
const {User} = require('../users/model');
const {Exercise} = require('../exercises/model');
const {Note} = require('../notes/model');
const {TEST_DATABASE_URL} = require('../config');

const expect = chai.expect;
chai.use(chaiHttp);

function tearDownDb() {
  return new Promise((resolve, reject) => {
    console.warn('Deleting database');
    mongoose.connection.dropDatabase()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function seedUserData() {
  console.info('seeding user data');
  return User.hashPassword("testpassword")
  .then(password=>{
    const seedData = [];
    for (let i = 1; i <= 10; i++) {
      seedData.push({
        username: faker.internet.userName().toLowerCase(),
         password: password,
         units: "kg."
      });
    }
    // this will return a promise
    return User.insertMany(seedData);    
  });

}

function seedExerciseData(users) {
  console.info('seeding exercise data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
    	name: faker.lorem.word(),
  		orm: faker.random.number(),
  		week: 1,
      user: users[0]
    });
  }
  // this will return a promise
  return Exercise.insertMany(seedData);
}

function seedNoteData(exercises) {
  console.info('seeding note data');
  const seedData = [];
  for (let i = 1; i <= 10; i++) {
    seedData.push({
      content: faker.lorem.sentences(),
      exercise: exercises[0]
    });
  }
  // this will return a promise
  return Note.insertMany(seedData);
}

module.exports = {TEST_DATABASE_URL, User, Exercise, Note, app, runServer, closeServer, tearDownDb, seedUserData, seedExerciseData, seedNoteData}