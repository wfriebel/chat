const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const _ = require('lodash');

const {generateMessage, generateLocationMessage} = require('./utils/message.js');
const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected');

  // Emit to a single socket
  socket.emit('newMessage', generateMessage('Admin','Welcome to the chat app'));

  socket.broadcast.emit('newMessage', generateMessage('Admin', 'New user joined'))

  socket.on('createMessage', (message, callback) => {
    // Emits to all connections
    io.emit('newMessage', generateMessage(message.from, message.text));
    callback('server confirmation');
  })

  socket.on('createLocationMessage', (coords) => {
    io.emit('newLocationMessage', generateLocationMessage('Admin', coords.lat, coords.lng));
  })

  socket.on('disconnect', () => {
    console.log('client disconneced');
  })
})

server.listen(port, () => {
  console.log(`listening on port ${port}`);
})
