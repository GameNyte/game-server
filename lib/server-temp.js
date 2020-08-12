'use strict';

const express = require('express');
const app = express();
const http = require('http');

const httpServer = http.createServer(app);



const v1 = require('../routes/v1');


app.use(express.json());
app.get('/', (request, response) => {
  response.send("I'm Alive")
})
app.use('/api', v1);











module.exports ={
  http: httpServer,
  server: app,
  start: port => {
    httpServer.listen(port, ()=> {
      console.log(`Server is running on port:: ${port}`);
    });
  },
};