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


app.use('/oauth', oauth); 

app.use('/api/v1', v1);

const profile = require( '../routes/profile.js' );

app.use( '/api/profile', profile );

const rooms = {};

let messages = [];
let roomMessages = [];

let players = [];
let roomPlayers = [];

function performAction(activity) {

  let gameAction = activity.split(/(?<=^\S+)\s/);
  let action = gameAction[0].toLowerCase();
  let payload = gameAction[1];
  let result = 'invalid command';
  switch(action) {

    case '!roll':
      const roller = new DiceRoller();
      let rollDice = roller.roll(payload);
      result = rollDice.output;
      return result;

    case '!color':
      const color = faker.commerce.color();
      result = color;
      return result;

    case '!name':
      const firstName = faker.name.firstName();
      const lastName = faker.name.lastName();
      result = `${firstName} ${lastName}`;
      return result;

    case '!boolean':
      const response = faker.random.boolean();
      result = response.toString();
      return result;

    default:
      return result;
    
  }
  
}


io.on('connection', (socket) => {


  socket.on('createRoom', () => {  
    const room =  faker.hacker.verb() + faker.hacker.noun();
    rooms[room] = room;
    socket.join(room);    
    socket.emit('new-room', room);
 
  })
  

  socket.on('join', (room) => {    
    rooms[room] = room; 
    socket.join(room);   
    messages.forEach((obj) => {
      if(obj.room === room) {
        roomMessages.push(obj.text);
      }
  })
  socket.emit('load-messages', roomMessages);
  roomMessages = [];
  })

  
  socket.on('message', (message) => {
    messages.push(message);
    io.to(message.room).emit('message', message.text);
    if(message.text.startsWith('!')) {
      let action = Object.assign({}, message);
      const response = performAction(action.text);
      action.text = response;
      messages.push(action);
      io.to(action.room).emit('message', action.text);
    }
  })

  socket.on('player', (player) => {
    players.push(player);
    players.forEach((obj) => {
      if(obj.room === player.room) {
        roomPlayers.push(obj);
      }
  })  
  io.to(player.room).emit('update-players', roomPlayers);
  roomPlayers = [];
  })

  socket.on('player-moved', (player) => {
    players = players.map(val => {
      if(val.name === player.name) {
        return player;
      }
      return val;
    })
    io.to(player.room).emit('player-moved', player);
  })

  

  socket.on('leave', (room) => {    
    socket.leave(room);        
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
