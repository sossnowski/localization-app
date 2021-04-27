const http = require('http');
const socketIO = require('socket.io');
const app = require('./app');

const port = process.env.PORT || 3000;

const server = http.createServer(app);

const io = socketIO(server);
// console.log(io);
io.on('connection', (socket) => {
  console.log('Made socket connection');
  if (socket.handshake.query.auth) {
    console.log(`user joined.. ${socket.handshake.query.auth}`);
    socket.join(socket.handshake.query.auth);
  }
  socket.on('userLeave', (data) => {
    socket.leave(data);
    console.log('user leaved the room');
  });
  socket.on('disconnect', () => {
    console.log('user disconnected');
  });
});

app.set('io', io);

server.listen(port);
console.log(port);
