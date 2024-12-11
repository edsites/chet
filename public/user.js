const socket = io();

const roomInput = document.getElementById('room'); // Novo input para a sala
const joinRoomButton = document.getElementById('joinRoomButton'); // Novo botão para entrar na sala
const sendButton = document.getElementById('sendButton');
const saveButton = document.getElementById('saveButton');
const usernameInput = document.getElementById('username');
const messageInput = document.getElementById('message');

let currentRoom = '';

const sendMessage = () => {
  const username = usernameInput.value;
  const message = messageInput.value;
  const data = `${username}: ${message}`;

  socket.emit('chat message', { room: currentRoom, msg: data });
  messageInput.value = '';
};

const saveChat = () => {
  const messages = document.getElementById('messages').innerText;
  const blob = new Blob([messages], { type: 'text/plain' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = 'chat.txt';
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
};

// Carregar mensagens anteriores
socket.on('load messages', (loadedMessages) => {
  const messageList = document.getElementById('messages');
  messageList.innerHTML = ''; // Limpa a lista antes de adicionar mensagens
  loadedMessages.forEach((message) => {
    const newMessage = document.createElement('li');
    newMessage.textContent = message;
    messageList.appendChild(newMessage);
  });
});

// Evento de clique no botão de entrar na sala
joinRoomButton.addEventListener('click', () => {
  currentRoom = roomInput.value;
  socket.emit('join room', currentRoom);
});

// Evento de clique no botão de enviar
sendButton.addEventListener('click', () => {
  sendMessage();
});

// Evento de clique no botão de salvar
saveButton.addEventListener('click', () => {
  saveChat();
});

// Evento de pressionamento da tecla "Enter" no campo de mensagem
messageInput.addEventListener('keypress', (event) => {
  if (event.key === 'Enter') {
    event.preventDefault();
    sendMessage();
  }
});

socket.on('chat message', (data) => {
  const messageList = document.getElementById('messages');
  const newMessage = document.createElement('li');
  newMessage.textContent = data;
  messageList.appendChild(newMessage);
});
