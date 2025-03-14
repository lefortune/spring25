const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const fs = require('fs');


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
    io.emit('connected', '<b>User ' + socket.id + ' connected</b>');
  
    socket.on('chat message', (msg) => {
      io.emit('chat message', socket.id + ": " + msg);
    });

    socket.on('send-image', (data) => {
      console.log('Received image data');
      
      const base64Data = data.split(',')[1];
      fs.writeFileSync('received-image.jpg', Buffer.from(base64Data, 'base64'));
      io.emit('image-received', data);
    });
  
    socket.on('disconnect', () => {
      io.emit('dc', '<b>User ' + socket.id + ' disconnected</b>');
    });
  });
  

server.listen(3000, () => {
  console.log('listening on *:3000');
});