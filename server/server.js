const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');
const _ = require('lodash');

const {generateMessage} = require('./utils/message.js');
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
    console.log('createMessage', message);

    // Emits to all connections
    const recievedMessage = _.pick(message, ['from', 'text'])
    io.emit('newMessage', generateMessage(...Object.values(recievedMessage)));
    callback('server confirmation');

    // Broadcasting
    // socket.broadcast.emit('newMessage', {
    //   from: 'server',
    //   text: 'hello',
    //   createdAt: new Date().getTime()
    // })
  })

  socket.on('disconnect', () => {
    console.log('client disconneced');
  })
})

server.listen(port, () => {
  console.log(`listening on port ${port}`);
})
