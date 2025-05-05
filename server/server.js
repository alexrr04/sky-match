const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const { findDestinationsWithinBudget } = require('./flightSearcher');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const lobbies = {};
const searchResults = new Map(); // Store flight search results temporarily
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
      members: [
        {
          id: socket.id,
          name,
          isHost: true,
        },
      ],
      lobbyCode,
      gameStarted: false,
      phase1Completed: new Set(),
      quizCompleted: new Set(),
      phase1Timer: null,
      quizTimer: null,
      phase1StartTime: null,
      quizStartTime: null,
    };

    socketToLobby[socket.id] = lobbyCode;

    // Join lobby room and host-specific room
    socket.join(lobbyCode);
    socket.join(`${lobbyCode}-host`);

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
      if (lobbies[lobbyCode]) {
        io.emit('phase1TimeUp', {
          lobbyCode,
          success: true,
        });
        clearTimeout(lobby.phase1Timer);
        setTimeout(() => {
          io.emit('navigateToQuiz', { lobbyCode });
        }, 1000);
      }
    }, 30000);

    io.emit('gameStarted', {
      lobbyCode,
      success: true,
      timestamp: lobby.phase1StartTime,
    });

    callback({ success: true });
  });

  socket.on('submitQuiz', (data, callback) => {
    const lobbyCode = socketToLobby[socket.id];
    const lobby = lobbies[lobbyCode];

    if (!lobby) {
      callback({ success: false, message: 'Lobby not found' });
      return;
    }

    // Store answers in a temporary map for this quiz round
    if (!lobby.currentQuizAnswers) {
      lobby.currentQuizAnswers = new Map();
    }
    const member = lobby.members.find((m) => m.id === socket.id);
    if (member) {
      lobby.currentQuizAnswers.set(member.name, data.answers);
    }

    // Add this user to completed set
    lobby.quizCompleted.add(socket.id);

    // Check if everyone has completed
    const allCompleted = Array.from(lobby.members).every((member) =>
      lobby.quizCompleted.has(member.id)
    );

    // Notify everyone about completion status
    io.emit('quizStatus', {
      lobbyCode,
      completed: Array.from(lobby.quizCompleted),
      total: lobby.members.length,
      timeStarted: lobby.quizStartTime,
    });

    if (allCompleted) {
      // Convert maps to objects for sending
      const allAnswers = {
        quizAnswers: Object.fromEntries(lobby.currentQuizAnswers || []),
        phase1Answers: Object.fromEntries(lobby.currentPhase1Answers || []),
      };

      // Send answers to the host room
      io.to(`${lobbyCode}-host`).emit('allAnswersCompiled', {
        success: true,
        data: allAnswers,
      });

      console.log(
        'Sending all answers to host:\n',
        JSON.stringify(allAnswers, null, 2)
      );

      // Navigate everyone to countdown
      setTimeout(() => {
        io.emit('navigateToCountdown', { lobbyCode });
      }, 1000);
    }

    callback({
      success: true,
      completed: lobby.quizCompleted.size,
      total: lobby.members.length,
    });
  });

  socket.on('submitPhase1', (data, callback) => {
    const lobbyCode = socketToLobby[socket.id];
    const lobby = lobbies[lobbyCode];

    if (!lobby) {
      callback({ success: false, message: 'Lobby not found' });
      return;
    }

    // Store answers in a temporary map for this phase
    if (!lobby.currentPhase1Answers) {
      lobby.currentPhase1Answers = new Map();
    }
    const member = lobby.members.find((m) => m.id === socket.id);
    if (member) {
      lobby.currentPhase1Answers.set(member.name, data.answers);
    }

    lobby.phase1Completed.add(socket.id);

    const allCompleted = Array.from(lobby.members).every((member) =>
      lobby.phase1Completed.has(member.id)
    );

    io.emit('phase1Status', {
      lobbyCode,
      completed: Array.from(lobby.phase1Completed),
      total: lobby.members.length,
    });

    if (allCompleted) {
      console.log(
        'All members completed phase 1\n' +
          JSON.stringify(
            Object.fromEntries(lobby.currentPhase1Answers),
            null,
            2
          )
      );
      if (lobby.phase1Timer) {
        clearTimeout(lobby.phase1Timer);
      }

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
        quizCompleted: Array.from(lobbies[lobbyCode].quizCompleted),
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

    // Join lobby room
    socket.join(lobbyCode);

    console.log(`Socket ${socket.id} joined lobby ${lobbyCode}`);

    callback({
      success: true,
      ...lobby,
      phase1Completed: Array.from(lobby.phase1Completed),
      quizCompleted: Array.from(lobby.quizCompleted),
    });

    io.emit('lobbyData', {
      ...lobby,
      phase1Completed: Array.from(lobby.phase1Completed),
      quizCompleted: Array.from(lobby.quizCompleted),
    });
  });

  socket.on('searchFlights', async (data) => {
    const { origin } = data;
    const lobbyCode = socketToLobby[socket.id];
    const lobby = lobbies[lobbyCode];

    if (!lobby || lobby.host !== socket.id) {
      return;
    }

    try {
      console.log(`Searching flights from ${origin} for lobby ${lobbyCode}`);
      const results = await findDestinationsWithinBudget(origin);

      // Store results for this origin
      if (!searchResults.has(lobbyCode)) {
        searchResults.set(lobbyCode, new Map());
      }
      searchResults.get(lobbyCode).set(origin, results);

      // Send results to host
      console.log(
        `Sending flight search results to host ${lobby.host} for lobby ${lobbyCode}`
      );
      io.to(`${lobbyCode}-host`).emit('flightSearchResults', {
        success: true,
        data: results,
        origin,
      });
    } catch (error) {
      console.error('Error searching flights:', error);
      io.to(`${lobbyCode}-host`).emit('flightSearchResults', {
        success: false,
        error: error.message,
        origin,
      });
    }
  });

  socket.on('computedDestination', (data) => {
    console.log('computedDestination', JSON.stringify(data));
    const lobbyCode = socketToLobby[socket.id];
    const lobby = lobbies[lobbyCode];

    if (!lobby || lobby.host !== socket.id) {
      return;
    }

    // Clear stored search results for this lobby
    searchResults.delete(lobbyCode);

    // Broadcast the computed destination to all members in the lobby
    console.log(`Broadcasting computed destination to lobby ${lobbyCode}:`);
    if (data.success) {
      io.emit('destinationComputed', {
        success: true,
        data: data,
      });
    } else {
      io.emit('destinationComputed', {
        success: false,
        message: 'Error computing destination',
      });
    }
  });

  socket.on('disconnect', () => {
    console.log('user disconnected', socket.id);

    const lobbyCode = socketToLobby[socket.id];
    if (lobbyCode && lobbies[lobbyCode]) {
      // Leave the lobby room
      socket.leave(lobbyCode);

      const isHost = lobbies[lobbyCode].host === socket.id;
      if (isHost) {
        socket.leave(`${lobbyCode}-host`);
      }

      lobbies[lobbyCode].members = lobbies[lobbyCode].members.filter(
        (member) => member.id !== socket.id
      );
      lobbies[lobbyCode].phase1Completed.delete(socket.id);
      lobbies[lobbyCode].quizCompleted.delete(socket.id);

      if (isHost) {
        // Clear any active timers
        if (lobbies[lobbyCode].phase1Timer) {
          clearTimeout(lobbies[lobbyCode].phase1Timer);
        }
        if (lobbies[lobbyCode].quizTimer) {
          clearTimeout(lobbies[lobbyCode].quizTimer);
        }

        // Clean up stored search results
        searchResults.delete(lobbyCode);
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
          quizCompleted: Array.from(lobbies[lobbyCode].quizCompleted),
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
