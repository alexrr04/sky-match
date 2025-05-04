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
  if (code in lobbies) {
    return generateLobbyCode(length);
  }
  return code;
}

io.on('connection', (socket) => {
  console.log('a user connected', socket.id);

  socket.on('createLobby', (data, callback) => {
    const lobbyCode = generateLobbyCode();
    const { name } = data;

    lobbies[lobbyCode] = {
      host: socket.id,
      members: [{ id: socket.id, name, isHost: true }],
      lobbyCode,
      gameStarted: false,
      phase1Completed: new Set(), // Track who completed phase 1
      phase1Timer: null,
      phase1StartTime: null,
    };

    socketToLobby[socket.id] = lobbyCode;

    console.log('Lobby created:', lobbies[lobbyCode]);
    callback({
      success: true,
      lobbyCode,
      members: lobbies[lobbyCode].members,
      host: socket.id,
    });
  });

  socket.on('startGame', (callback) => {
    const lobbyCode = socketToLobby[socket.id];
    const lobby = lobbies[lobbyCode];

    if (!lobby) {
      callback({ success: false, message: 'Lobby not found' });
      return;
    }

    if (lobby.host !== socket.id) {
      callback({ success: false, message: 'Only the host can start the game' });
      return;
    }

    // Mark the game as started and set up phase 1 timer
    lobby.gameStarted = true;
    lobby.phase1StartTime = Date.now();
    lobby.phase1Timer = setTimeout(() => {
      // Time's up for phase 1
      if (lobbies[lobbyCode]) {
        io.emit('phase1TimeUp', {
          lobbyCode,
          success: true,
        });
        clearTimeout(lobby.phase1Timer);
        // Auto-advance after 1 second to ensure everyone gets the timeUp event
        setTimeout(() => {
          io.emit('navigateToQuiz', { lobbyCode });
        }, 1000);
      }
    }, 25000); // 25 seconds

    // Notify all members that the game is starting
    io.emit('gameStarted', {
      lobbyCode,
      success: true,
      timestamp: lobby.phase1StartTime,
    });

    callback({ success: true });
  });

  socket.on('submitPhase1', (data, callback) => {
    const lobbyCode = socketToLobby[socket.id];
    const lobby = lobbies[lobbyCode];

    if (!lobby) {
      callback({ success: false, message: 'Lobby not found' });
      return;
    }

    // Add this user to completed set
    lobby.phase1Completed.add(socket.id);

    // Store their answers (if needed)
    // TODO: Store answers if needed for later use

    // Check if everyone has completed
    const allCompleted = Array.from(lobby.members).every((member) =>
      lobby.phase1Completed.has(member.id)
    );

    // Notify everyone about completion status
    io.emit('phase1Status', {
      lobbyCode,
      completed: Array.from(lobby.phase1Completed),
      total: lobby.members.length,
    });

    if (allCompleted) {
      // Clear the timer since everyone finished early
      if (lobby.phase1Timer) {
        clearTimeout(lobby.phase1Timer);
      }

      // Give a short delay before navigation to ensure status is seen
      setTimeout(() => {
        io.emit('navigateToQuiz', { lobbyCode });
      }, 1000);
    }

    callback({
      success: true,
      completed: lobby.phase1Completed.size,
      total: lobby.members.length,
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
      const lobbyState = {
        ...lobbies[lobbyCode],
        phase1Completed: Array.from(lobbies[lobbyCode].phase1Completed),
        success: true,
      };
      console.log(`Sending lobby state for ${lobbyCode}:`, lobbyState);
      callback(lobbyState);
    } else {
      callback({ success: false, message: 'Lobby not found' });
    }
  });

  socket.on('joinLobby', (data, callback) => {
    const { lobbyCode } = data;
    const lobby = lobbies[lobbyCode];

    if (!lobby) {
      callback({ success: false, message: 'Lobby not found' });
      return;
    }

    if (lobby.gameStarted) {
      callback({ success: false, message: 'Game has already started' });
      return;
    }

    lobby.members.push({
      id: socket.id,
      name: data.name || 'Guest',
      isHost: false,
    });

    socketToLobby[socket.id] = lobbyCode;

    console.log(`Socket ${socket.id} joined lobby ${lobbyCode}`);

    callback({
      success: true,
      ...lobby,
      phase1Completed: Array.from(lobby.phase1Completed),
    });

    io.emit('lobbyData', {
      ...lobby,
      phase1Completed: Array.from(lobby.phase1Completed),
    });
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);

    const lobbyCode = socketToLobby[socket.id];
    if (lobbyCode && lobbies[lobbyCode]) {
      const isHost = lobbies[lobbyCode].host === socket.id;

      lobbies[lobbyCode].members = lobbies[lobbyCode].members.filter(
        (member) => member.id !== socket.id
      );
      lobbies[lobbyCode].phase1Completed.delete(socket.id);

      if (isHost) {
        // Clear any active timers
        if (lobbies[lobbyCode].phase1Timer) {
          clearTimeout(lobbies[lobbyCode].phase1Timer);
        }

        delete lobbies[lobbyCode];
        io.emit('lobbyData', {
          success: false,
          message: 'Lobby closed: Host disconnected',
          lobbyCode,
        });
        console.log(`Lobby ${lobbyCode} deleted because host disconnected`);
      } else if (lobbies[lobbyCode].members.length > 0) {
        io.emit('lobbyData', {
          ...lobbies[lobbyCode],
          phase1Completed: Array.from(lobbies[lobbyCode].phase1Completed),
        });
      }
    }

    delete socketToLobby[socket.id];
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
