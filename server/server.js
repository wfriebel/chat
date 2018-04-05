const path = require('path');
const http = require('http');
const express = require('express');
const socketIO = require('socket.io');

const publicPath = path.join(__dirname, '../public')
const port = process.env.PORT || 3000;

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('new user connected');

  // Emit to a single socket
  socket.emit('newMessage', {
    from: 'Admin',
    text: 'Welcome to the chat app',
    createdAt: new Date().getTime()
  })

  socket.broadcast.emit('newMessage', {
    from: 'Admin',
    text: 'New user joined',
    createdAt: new Date().getTime()
  })

  socket.on('createMessage', (message) => {
    console.log('createMessage', message);
    // Emits to all connections
    io.emit('newMessage', {
      ...message,
      createdAt: new Date().getTime()
    });

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
