'use strict'

var cors = require('cors')
const express = require('express');
const app = express();
const http = require('http');
const faker = require('faker');
const httpServer = http.createServer(app);
const { DiceRoller } = require('rpg-dice-roller');


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

app.use('/api', v1);

const profile = require( '../routes/profile.js' );

app.use( '/api/profile', profile );

const rooms = {};

let messages = [];
let roomMessages = [];

let players = [];
let roomPlayers = [];

function performAction(message) {
  let gameAction = message.text.split(/(?<=^\S+)\s/);
  let action = gameAction[0].toLowerCase();
  let payload = gameAction[1];
  console.log('gameAction is: ', gameAction);
  switch(action) {

    case '!roll':
      const roller = new DiceRoller();
      let rollDice = roller.roll(payload);
      message.text = rollDice.output;
      return message;

    case '!color':
      const color = faker.commerce.color();
      message.text = color;
      return message;

    case '!name':
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      message.text = `${firstName} ${lastName}`;
      return message;

    case '!boolean':
      const response = faker.random.boolean();
      message.text = response.toString();
      return message;

    default:
      message.text = 'invalid command';
      return message;
    
  }
  
}


io.on('connection', (socket) => {


  socket.on('createRoom', () => {  
    const room =  faker.hacker.verb() + faker.hacker.noun();
    rooms[room] = room;
    // have the socket join the room they've just created.
    socket.join(room);    
    console.log("Joined", room);
    socket.emit('new-room', room);
 
  })
  

  socket.on('join', (room) => {    
    rooms[room] = room; 
    socket.join(room);   
    console.log("Joined", room);
    messages.forEach((obj) => {
      // console.log(obj);
      if(obj.room === room) {
        roomMessages.push(obj.text);
      }
  })  
  console.log(roomMessages);
  socket.emit('load-messages', roomMessages);
  roomMessages = [];
  })

  
  socket.on('message', (message) => {
    console.log('got message from room: ', message.room);
    messages.push(message); 
    io.to(message.room).emit('message', message.text);
    if(message.text.startsWith('!')) {
      let response = performAction(message);
      messages.push(response);
      console.log('response: ', response);
      io.to(response.room).emit('message', response.text);
    }
  
  })

  socket.on('player', (player) => {
    console.log('this is the player: ', player);
    players.push(player);
    players.forEach((obj) => {
      console.log(obj.room);
      if(obj.room === player.room) {
        roomPlayers.push(obj);
      }
  })  
  console.log(roomPlayers);
  socket.emit('update-players', roomPlayers);
  roomPlayers = [];
  })

  

  socket.on('leave', (room) => {    
    socket.leave(room);    
    console.log("Left", room);    
  })

});




module.exports ={
  performAction: performAction,
  server: app,
  start: port => {
    httpServer.listen(port, ()=> {
      console.log(`Server is running on port:: ${port}`);
    });
  },
};
