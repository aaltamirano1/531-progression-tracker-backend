const chai = require('chai');
const chaiHttp = require('chai-http');
const faker = require('faker');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const {TEST_DATABASE_URL, JWT_SECRET} = require('../config');
const {User, Exercise, app, runServer, closeServer, tearDownDb, seedUserData, seedExerciseData} = require("./test-server");

const expect = chai.expect;
chai.use(chaiHttp);

describe('Exercises', function(){
	before(function(){
		return runServer(TEST_DATABASE_URL);
	});
	beforeEach(function(){
		return seedUserData()
		.then(users=>{
			return seedExerciseData(users);
		})
	});
	after(function(){
		return closeServer();
	});
	afterEach(function(){
		return tearDownDb();
	});

	it('Should create an exercise on POST /exercises', function(){
		return User.find()
		.then(users=>{
			const token = jwt.sign( { user: users[0] }, JWT_SECRET, { algorithm: 'HS256', subject: users[0].username, expiresIn: '7d' } );
			return chai
	    .request(app)
	    .post('/exercises')
	    .set('authorization', `Bearer ${token}`)
	    .send({
	    	name: "Squats",
	  		orm: 200,
	      user: users[0]
	    })
  	})
    .then(res=>{
    	expect(res).to.have.status(201);
    })
	});
	it('Should update an exercise on PUT /exercises', function(){
		let updatedExercise = {
    	name: "Squats",
  		orm: 200,
      week: 3
    };
		let _user;
		return User.find()				
		.then(users=>{
			_user = users[0];
			return Exercise.find({user: _user._id})
		})
		.then(exercises=>{
			const token = jwt.sign( { user: _user }, JWT_SECRET, { algorithm: 'HS256', subject: _user.username, expiresIn: '7d' } );
			return chai
	    .request(app)
	    .put(`/exercises/${exercises[0].id}`)
	    .set('Authorization', `Bearer ${token}`)
	    .send(updatedExercise)
  	})
    .then(res=>{
    	expect(res).to.have.status(200);
    	expect(res).to.be.json;
			expect(res.body).to.be.a('object');
			expect(res.body).to.deep.equal(updatedExercise);
    });
	});
	it('Should get exercises by associated user id on GET /exercises/by-user/:user_id', function(){
		return User.find()
		.then(users=>{
			return chai
	    .request(app)
	    .get(`/exercises/by-user/${users[0].id}`)
		})
		.then(res=>{
    	expect(res).to.have.status(200);
    	expect(res).to.be.json;
			expect(res.body).to.be.a('array');
			expect(res.body[0]).to.include.keys('name', 'orm', 'week', 'user', '_id');
    });
	});
	it('Should get an exercise by its id on GET /exercises/:id', function(){
		return Exercise.find()
		.then(exercises=>{
			return chai
	    .request(app)
	    .get(`/exercises/${exercises[0].id}`)
		})
		.then(res=>{
    	expect(res).to.have.status(200);
    	expect(res).to.be.json;
			expect(res.body).to.be.a('object');
			expect(res.body).to.include.keys('name', 'orm', 'week', 'user', '_id');
    });
	});
	it('Should delete an exercise on DELETE /exercises/:id', function(){
		let _user;
		return User.find()				
		.then(users=>{
			_user = users[0];
			return Exercise.find({user: _user._id})
		})
		.then(exercises=>{
			const token = jwt.sign( { user: _user }, JWT_SECRET, { algorithm: 'HS256', subject: _user.username, expiresIn: '7d' } );
			return chai
	    .request(app)
	    .delete(`/exercises/${exercises[0].id}`)
	    .set('Authorization', `Bearer ${token}`)
  	})
    .then(res=>{
    	expect(res).to.have.status(204);
    });
  });
});