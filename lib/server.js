'use strict'

var cors = require('cors')
const express = require('express');
const app = express();
const http = require('http');
const faker = require('faker');
const httpServer = http.createServer(app);


const socketio = require('socket.io');

const io = socketio(httpServer);
app.use(cors())


const v1 = require('../routes/v1');
const oauth = require('../lib/auth/router.js');

app.use(express.json());
app.get('/', (request, response) => {
  response.send("I'm Alive")
})


app.use('/oauth', oauth); // oauth must go before api route to hit the oauth first

const profile = require( '../routes/profile.js' );

app.use( '/api/profile', profile );
app.use('/api', v1);



const rooms = {};

let messages = [];
let roomMessages = [];


io.on('connection', (socket) => {

  socket.on('createRoom', () => {   
    const room = {
      id: faker.hacker.verb() + faker.hacker.noun(), // generate a unique id for the new room, that way we don't need to deal with duplicates.
      sockets: []
    };
    rooms[room.id] = room;
    // have the socket join the room they've just created.
    socket.join(room.id);    
    console.log("Joined", room.id);
    socket.emit('new-room', room);
 
  })


  socket.on('join', (room) => {    
    socket.join(room);    
    console.log("Joined", room);
    let clients = io.sockets.adapter.rooms[room].sockets;  
    console.log('clients in room: ', clients);   
  })

  socket.on('leave', (room) => {    
    socket.leave(room);    
    console.log("Left", room);    
  })

  socket.on('message', (message) => {
    console.log('got message', message.room);
    messages.push(message);
    
    // console.log(messages);
    io.broadcast.to(message.room).emit('message', 'i got your message');
    // io.sockets.in(message.room).emit('message', 'i got your message');
  })

  // socket.on('message', (message) => {
  //   messages.push(message);
  //   roomMessages = [];
  //   messages.forEach((obj) => {
  //     if(obj.room === message.room) {
  //       roomMessages.push(obj);
  //       io.to(message.room).emit('message', roomMessages);
  //     }
  //   })
  // });
});




module.exports ={
  server: app,
  start: port => {
    httpServer.listen(port, ()=> {
      console.log(`Server is running on port:: ${port}`);
    });
  },
};
