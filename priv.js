const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

const messagesFile = 'messages.json';

const loadMessages = () => {
  if (fs.existsSync(messagesFile)) {
    const data = fs.readFileSync(messagesFile, 'utf8');
    return JSON.parse(data);
  }
  return {};
};

const saveMessages = (messages) => {
  fs.writeFileSync(messagesFile, JSON.stringify(messages, null, 2));
};

let messages = loadMessages();

app.use(express.static('public'));

io.on('connection', (socket) => {
  console.log('A user connected');

  // Entrar em uma sala específica
  socket.on('join room', (room) => {
    socket.join(room);
    if (messages[room]) {
      socket.emit('load messages', messages[room]);
    }
  });

  // Escuta por mensagens de chat em salas específicas
  socket.on('chat message', ({room, msg}) => {
    if (!messages[room]) {
      messages[room] = [];
    }
    messages[room].push(msg);
    saveMessages(messages);
    io.to(room).emit('chat message', msg);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected');
  });
});

server.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
