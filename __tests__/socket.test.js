var io = require('socket.io-client')
  , io_server = require('socket.io').listen(3000);
describe('basic socket.io example', function() {
  var socket;
  beforeEach(function(done) {
    // Setup
    socket = io.connect('http://localhost:3000', {
      'reconnection delay' : 0
      , 'reopen delay' : 0
      , 'force new connection' : true
      , transports: ['websocket']
    });
    socket.on('connect', () => {
      done();
    });
    socket.on('disconnect', () => {
      // console.log('disconnected...');
    });
  });
  afterEach((done) => {
    // Cleanup
    if(socket.connected) {
      socket.disconnect();
    }
    io_server.close();
    done();
  });

  it('should join a room', (done) => {
    // once connected, emit Hello World
    io_server.emit('join', 'test room');
    socket.once('join', (room) => {
      console.log(room);
      // Check that the message matches
      expect(room).toBe('test room');
      done();
    });
    io_server.on('connection', (socket) => {
      expect(socket).to.not.be.null;
      done();
    });
  });
  
});

