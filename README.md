# 5/3/1 Progression Tracker (Back End)

This is a tool for people running a 5/3/1 progression on a lift or following a 5/3/1 program. Users are asked to provide a name and the most amount of weight they can lift for an exercise they would like to track. This app programmatically creates a 4 week schedule to increase the lift based on a popular schedule/method known as a 5/3/1 progression created by Jim Wendler. Users can also keep notes and reminders for a given exercise and track what week they are on.

## Technologies Used
- [Node.js](https://nodejs.org/en/) for package management.
- [Express](http://expressjs.com/) for managing routes, requests, and responses.
- [Mongoose](https://mongoosejs.com/) for creating models.
- [Passport](http://www.passportjs.org/) for setting up local and JWT authentication.
- [JSON Web Tokens](https://jwt.io/) to protect endpoints by requiring users to log in.
- [Bcrypt](https://www.npmjs.com/package/bcrypt) to encrypt passwords and validate them when users log in.
- [Body-Parser](https://www.npmjs.com/package/body-parser) for parsing json request bodies.
- [Chai](https://www.chaijs.com/) and [Mocha](https://mochajs.org/) for testing requests to endpoints.
- [Faker](https://github.com/marak/Faker.js/) to seed test databases fake user and journal entries.
- [TravisCI](https://travis-ci.org/) for continuous integration, pushes to heroku if all tests pass.

## You can check out the Front End [here](https://github.com/aaltamirano1/531-progression-tracker/).  
