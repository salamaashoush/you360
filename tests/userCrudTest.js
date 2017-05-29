const should = require('should');
const request = require('supertest');
const app = require('../app');
const URI = require('./spec_helper').URI;
const mongoose = require('mongoose');

const validUser = { password: 'secret', lastName: 'Doe', firstName: 'John', email: 'johndoe@exampledomain.com' };


describe('************* USER CREATION *************', () => {
  after((done) => {
    const colls = 'users';
    mongoose.connection.collections[colls].drop(() => done());
  });

  it('should FAIL [422] to create a user without parameters', (done) => {
    request(app)
      .post('/api/users')
      .set('X-Real-IP', URI)
      .expect(422)
      .end((err, res) => {
        if (err) done(err);
        res.body.error.should.be.eql({
            "email": {
                "param": "email",
                "msg": "Invalid Email"
            },
            "password": {
                "param": "password",
                "msg": "Password is Required"
            },
            "firstName": {
                "param": "firstName",
                "msg": "First Name is Required"
            },
            "lastName": {
                "param": "lastName",
                "msg": "Last Name is Required"
            }
        });
        done();
      });
  });

  it('should FAIL [422] to create a user with incomplete parameters', (done) => {
    request(app)
      .post('/api/register')
      .set('X-Real-IP', URI)
      .type('form')
      .send({ email: 'johndoe@exampledomain.com', lastName: 'Doe', firstName: 'John' })
      .expect(422)
      .end((err, res) => {
        if (err) done(err);
        res.body.error.should.be.eql({
            "password": {
                "param": "password",
                "msg": "Password is Required"
            }
        });
        done();
      });
  });

  it('should CREATE [201] a valid user', (done) => {
    request(app)
      .post('/api/register')
      .set('X-Real-IP', URI)
      .type('form')
      .send(validUser)
      .expect(201)
      .end((err, res) => {
        if (err) done(err);
        res.body.user.should.be.eql({
            "success": true,
            "message": "User Added Successfully"
        });
        done();
      });
  });

  it('should FAIL [422] to create a user with occupied email', (done) => {
    request(app)
      .post('/api/register')
      .set('X-Real-IP', URI)
      .type('form')
      .send(validUser)
      .expect(422)
      .end((err, res) => {
        if (err) done(err);
        res.body.error.should.be.eql('That email address is already in use.');
        done();
      });
  });
});

describe('************* AUTH LOGIN *************', () => {
  before((done) => {
    request(app)
      .post('/api/register')
      .set('X-Real-IP', URI)
      .type('form')
      .send(validUser)
      .expect(201)
      .end((err) => {
        if (err) done(err);
        done();
      });
  });

  after((done) => {
    const colls = 'users';
    mongoose.connection.collections[colls].drop(() => done());
  });

  it('should FAIL [400] to login without parameters', (done) => {
    request(app)
      .post('/api/login')
      .set('X-Real-IP', URI)
      .expect(400, done);
  });

  it('should FAIL [400] to login with bad parameters', (done) => {
    request(app)
      .post('/api/login')
      .set('X-Real-IP', URI)
      .type('form')
      .send({ wrongparam: 'err' })
      .expect(400, done);
  });

  it('should FAIL [401] to login with invalid credentials', (done) => {
    request(app)
      .post('/api/login')
      .set('X-Real-IP', URI)
      .type('form')
      .send({ email: 'err', password: '22' })
      .expect(401, done);
  });

  it('should LOGIN [200] with valid credential', (done) => {
    request(app)
      .post('/api/login')
      .set('X-Real-IP', URI)
      .type('form')
      .send(validUser)
      .expect(200)
      .end((err, res) => {
        if (err) done(err);
        res.body.token.should.be.an.instanceOf(String);
        res.body.user.should.be.an.instanceOf(Object);
        done();
      });
  });
});
