const express = require('express');
const http = require('http');
const { Server } = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const lobbies = {};
const socketToLobby = {}; // Keep track of which socket is in which lobby

function generateLobbyCode(length = 6) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('createLobby', (data, callback) => {
    const lobbyCode = generateLobbyCode();
    const { name } = data;

    // Create the lobby with the host as first member
    lobbies[lobbyCode] = {
      host: socket.id,
      members: [{ id: socket.id, name, isHost: true }],
      lobbyCode,
    };

    // Associate this socket with the lobby
    socketToLobby[socket.id] = lobbyCode;

    console.log('Lobby created:', lobbyCode);
    callback({
      success: true,
      lobbyCode,
      members: lobbies[lobbyCode].members,
    });
  });

  socket.on('storeLobbyCode', (data) => {
    const { lobbyCode } = data;
    if (lobbies[lobbyCode]) {
      socketToLobby[socket.id] = lobbyCode;
      console.log(`Socket ${socket.id} associated with lobby ${lobbyCode}`);
    }
  });

  socket.on('getLobbyState', (callback) => {
    const lobbyCode = socketToLobby[socket.id];
    if (lobbyCode && lobbies[lobbyCode]) {
      console.log(`Sending lobby state for ${lobbyCode}:`, lobbies[lobbyCode]);
      callback(lobbies[lobbyCode]);
    } else {
      callback({ success: false, message: 'Lobby not found' });
    }
  });

  socket.on('joinLobby', (data, callback) => {
    const { lobbyCode } = data;
    if (lobbies[lobbyCode]) {
      lobbies[lobbyCode].members.push({
        id: socket.id,
        name: data.name || 'Guest',
        isHost: false,
      });

      // Associate this socket with the lobby
      socketToLobby[socket.id] = lobbyCode;

      console.log(`Socket ${socket.id} joined lobby ${lobbyCode}`);
      callback({ success: true, lobbyCode });

      // Notify all members in the lobby about the update
      io.emit('lobbyData', lobbies[lobbyCode]);
    } else {
      callback({ success: false, message: 'Lobby not found' });
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);

    // Clean up the socket's lobby association
    const lobbyCode = socketToLobby[socket.id];
    if (lobbyCode && lobbies[lobbyCode]) {
      // Remove the member from the lobby
      lobbies[lobbyCode].members = lobbies[lobbyCode].members.filter(
        (member) => member.id !== socket.id
      );

      // If it was the host, delete the lobby
      if (lobbies[lobbyCode].host === socket.id) {
        delete lobbies[lobbyCode];
        console.log(`Lobby ${lobbyCode} deleted because host disconnected`);
      } else {
        // Notify remaining members about the update
        io.emit('lobbyData', lobbies[lobbyCode]);
      }
    }

    // Clean up the socket's lobby association
    delete socketToLobby[socket.id];
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
