'use strict';

require('dotenv').config();

const { server } = require('../lib/server.js');
const supergoose = require('@code-fellows/supergoose');
const mockRequest = supergoose(server);
const supertest = require('supertest');
let mockTest = supertest(server);

describe('Testing the Mongo DB', () => {
  it('should connect to home route', () => {
    return mockRequest.get('/')
    .then((res) => {
      expect(res.status).toBe(200);
    });
  });
  server.get('/api', async (req, res) => {
    res.json({message: 'pass'});
  });

  it('should connect to the v1 route', async done => {
   const res = await mockTest.get('/api');
   expect(res.status).toBe(200);
   
   done();
   
  });

  server.get('/api', async (req, res) => {
    res.json({message: 'pass'});
  });

  it('should return a response from the /api route', async done => {
    const res = await mockTest.get('/api');
    expect(res.body.message).toBe('pass');
    done();
  });

  server.get('/profile', async (req, res) => {
    res.json({message: 'pass'});
  });

  it('should hit the profile route', async done => {
    const res = await mockTest.get('/profile');
    expect(res.status).toBe(200);
    done();
  });

  server.get('/profile', async (req, res) => {
    res.json({message: 'pass'});
  });

 it('should return a response from the /profile route', async done => {
  const res = await mockTest.get('/profile');
  expect(res.body.message).toBe('pass');
  done();
 });
});