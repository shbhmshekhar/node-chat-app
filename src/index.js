const path = require('path');
const http = require('http');
const socketio = require('socket.io');
const express = require('express');
const Filter = require('bad-words');
const {
  generateMessage,
  generateLocationMessage,
} = require('./utils/messages');

const {
  addUser,
  removeUser,
  getUser,
  getUsersInRoom,
} = require('./utils/users');

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const publicDirectoryPath = path.join(__dirname, '../public');
const port = process.env.PORT || 3000;

app.use(express.static(publicDirectoryPath));

io.on('connection', (socket) => {
  socket.on('join', (options, callback) => {
    const { error, user } = addUser({ id: socket.id, ...options });

    console.log('onJoin', user);
    if (error) {
      return callback(error);
    }
    socket.join(user.room);

    socket.emit('message', generateMessage(`Hi ${user.username}`));
    // notifies all user but current user
    socket.broadcast
      .to(user.room)
      .emit('message', generateMessage(`${user.username} has joined`));

    callback();
  });

  socket.on('sendMessage', (message, callback) => {
    const filter = new Filter();
    if (filter.isProfane(message)) {
      return callback('Profanity is not allowed');
    }
    io.emit('message', generateMessage(message));
    callback();
  });

  socket.on('sendLocation', (coords, callback) => {
    io.emit(
      'sendLocationMessage',
      generateLocationMessage(
        `https://google.com/maps?q=${coords.latitude},${coords.longitude}`
      )
    );
    callback();
  });

  socket.on('disconnect', () => {
    const user = removeUser(socket.id);
    if (user) {
      io.to(user.room).emit(
        'message',
        generateMessage(`${user.username} has left`)
      );
    }
  });
});

server.listen(port, () => {
  console.log(`Server started at port: ${port}`);
});

/*let count = 0;

io.on('connection', (socket) => {
  console.log('New Socket Connection');
  socket.emit('countUpdated', count);

  socket.on('increment', () => {
    count++;
    // socket.emit('countUpdated', count); // notifies only to the current user
    io.emit('countUpdated', count); // notifies all connected user
  });
});*/
