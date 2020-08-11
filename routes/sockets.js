const server = require('../lib/server.js');

const socketio = require('socket.io');

const io = socketio(server.http);
const uuid = require('uuid');

const rooms = {};

const joinRoom = (socket, room) => {
  room.sockets.push(socket);
  socket.join(room.id, () => {
    // store the room id in the socket for future use
    socket.roomId = room.id;
    console.log(socket.id, "Joined", room.id);
  });
};


io.on('connection', (socket) => {

  socket.id = uuid();
  console.log('socket connected: ', socket.id);
});

io.on('createRoom', (roomName, callback) => {
  const room = {
    id: uuid(), // generate a unique id for the new room, that way we don't need to deal with duplicates.
    name: roomName,
    sockets: []
  };
  rooms[room.id] = room;
  // have the socket join the room they've just created.
  joinRoom(socket, room);
  callback();
});


module.exports = io;
