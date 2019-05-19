const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../config');
const {User, Exercise, Note, app, runServer, closeServer, tearDownDb, seedUserData, seedExerciseData, seedNoteData} = require("./test-server");

const expect = chai.expect;
chai.use(chaiHttp);

describe('Notes', function(){
	before(function(){
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function(){
		return seedUserData()
		.then(users=>{
			return seedExerciseData(users);
		})
		.then(exercises=>{
			return seedNoteData(exercises);
		});
	});
	after(function(){
		return closeServer();
	});
	afterEach(function(){
		return tearDownDb();
	});

	it('Should create a note on POST /notes', function(){
		let token;
		return User.find()
		.then(users=>{
			token = jwt.sign({ user: users[0] }, JWT_SECRET, { algorithm: 'HS256', subject: users[0].username, expiresIn: '7d' });
			return Exercise.find()
		})		
		.then(exercises=>{
			return chai
	    .request(app)
	    .post('/notes')
	    .set('authorization', `Bearer ${token}`)
	    .send({
	    	content: 'Push up with your traps and push your feet down through the floor.',
	      exercise: exercises[0]
	    });
		})
		.then(res=>{
    	expect(res).to.have.status(201);
    })
	});
	it('Should update a note on PUT /notes', function(){
		let updatedNote = {content: 'Push up with your traps and push your feet down through the floor.'};
		let token;

		return User.find()
		.then(users=>{
			token = jwt.sign({ user: users[0] }, JWT_SECRET, { algorithm: 'HS256', subject: users[0].username, expiresIn: '7d' });
			return Note.find()
		})					
		.then(notes=>{
			return chai
	    .request(app)
	    .put(`/notes/${notes[0].id}`)
	    .set('Authorization', `Bearer ${token}`)
	    .send(updatedNote)
  	})
    .then(res=>{
    	expect(res).to.have.status(200);
    	expect(res).to.be.json;
			expect(res.body).to.be.a('object');
			expect(res.body).to.deep.equal(updatedNote);
    });
	});
	it('Should get notes by associated exercise id on GET /notes/by-exercise/:exercise_id', function(){
		return Exercise.find()
		.then(exercises=>{
			return chai
	    .request(app)
	    .get(`/notes/by-exercise/${exercises[0].id}`)
		})
		.then(res=>{
    	expect(res).to.have.status(200);
    	expect(res).to.be.json;
			expect(res.body).to.be.a('array');
			expect(res.body[0]).to.include.keys('content', '_id');
    });
	});
	it('Should get a note by its id on GET /notes/:id', function(){
		return Note.find()
		.then(notes=>{
			return chai
	    .request(app)
	    .get(`/notes/${notes[0].id}`)
		})
		.then(res=>{
    	expect(res).to.have.status(200);
    	expect(res).to.be.json;
			expect(res.body).to.be.a('object');
			expect(res.body).to.include.keys('content', '_id');
    });
	});
	it('Should delete a note on DELETE /notes/:id', function(){
		let token;
		return User.find()
		.then(users=>{
			token = jwt.sign({ user: users[0] }, JWT_SECRET, { algorithm: 'HS256', subject: users[0].username, expiresIn: '7d' });
			return Note.find();
		})
		.then(notes=>{
			return chai
	    .request(app)
	    .delete(`/notes/${notes[0].id}`)
	    .set('Authorization', `Bearer ${token}`)
  	})
    .then(res=>{
    	expect(res).to.have.status(204);
    });
  });
	
});