'use strict';


const express = require('express');
const app = express();
const http = require('http');
const httpServer = http.createServer(app);


const socketio = require('socket.io');

const io = socketio(httpServer);
const uuid = require('uuid').v4;


const v1 = require('../routes/v1');
const oauth = require('../lib/auth/router.js');


app.use(express.json());
app.get('/', (request, response) => {
  response.send("I'm Alive")
})


app.use('/oauth', oauth); // oauth must go before api route to hit the oauth first

app.use('/api', v1);



const rooms = {};

console.log('these are our rooms: ', rooms);

const joinRoom = (socket, room) => {
  room.sockets.push(socket);
  socket.join(room.id);
  console.log(socket.id, "Joined", room.id);
  // socket.join(room.id, () => {
  //   console.log('room is: ', room.id);
  //   // store the room id in the socket for future use
  //   socket.roomId = room.id;
  // });
};


io.on('connection', (socket) => {

  socket.id = uuid();
  console.log('socket connected: ', socket.id);

  socket.on('createRoom', () => {
    const room = {
      id: uuid(), // generate a unique id for the new room, that way we don't need to deal with duplicates.
      sockets: []
    };
    rooms[room.id] = room;
    // room.sockets.push(socket);
    // have the socket join the room they've just created.
    socket.join(room.id);
    
    console.log(socket.id, "Joined", room.id);
    // io.to(room.id).emit('new-room', room);
    socket.emit('new-room', room);
 
  })

const profile = require( '../routes/profile.js' );
app.use('/api/v1', v1)


  socket.on('join', (room) => {
    
    socket.join(room);
    
    console.log(socket.id, "Joined", room);
    // io.to(room.id).emit('new-room', room);
    // socket.emit('joined', room);
 
  })


});

app.use( '/api/profile', profile );


module.exports ={
  server: app,
  start: port => {
    httpServer.listen(port, ()=> {
      console.log(`Server is running on port:: ${port}`);
    });
  },
};
