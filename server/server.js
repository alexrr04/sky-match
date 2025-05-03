const WebSocket = require('ws');
const { v4: uuidv4 } = require('uuid');
const dotenv = require('dotenv');

dotenv.config();

const port = process.env.PORT || 8080;
const wss = new WebSocket.Server({ port });

// In-memory storage
const connections = new Map(); // playerId -> { ws, lobbyCode }
const lobbies = new Map(); // lobbyCode -> Lobby

function generateLobbyCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let code;
  do {
    code = Array(6)
      .fill()
      .map(() => chars[Math.floor(Math.random() * chars.length)])
      .join('');
  } while (lobbies.has(code));
  return code;
}

function broadcast(lobbyCode, message, excludePlayerId = null) {
  const lobby = lobbies.get(lobbyCode);
  if (!lobby) return;

  Object.entries(lobby.players).forEach(([playerId, player]) => {
    if (
      playerId !== excludePlayerId &&
      player.ws.readyState === WebSocket.OPEN
    ) {
      player.ws.send(JSON.stringify(message));
    }
  });
}

function handleDisconnect(playerId) {
  const connection = connections.get(playerId);
  if (!connection) return;

  const { lobbyCode } = connection;
  if (lobbyCode) {
    const lobby = lobbies.get(lobbyCode);
    if (lobby) {
      delete lobby.players[playerId];

      // If it was the host that disconnected, try to promote someone else
      if (lobby.hostId === playerId) {
        const newHost = Object.keys(lobby.players)[0];
        if (newHost) {
          lobby.hostId = newHost;
          lobby.players[newHost].isHost = true;
          broadcast(lobbyCode, {
            type: 'hostChanged',
            newHostId: newHost,
          });
        }
      }

      // Broadcast player left
      broadcast(lobbyCode, {
        type: 'playerLeft',
        playerId,
      });

      // Clean up empty lobbies
      if (Object.keys(lobby.players).length === 0) {
        lobbies.delete(lobbyCode);
      }
    }
  }

  connections.delete(playerId);
}

function checkAllAnswered(lobby, questionId) {
  const playerCount = Object.keys(lobby.players).length;
  const answersCount = Object.keys(lobby.answers[questionId] || {}).length;
  return answersCount === playerCount;
}

function startQuestionTimer(lobby, questionId) {
  if (lobby.currentQuestion?.timer) {
    clearTimeout(lobby.currentQuestion.timer.timeout);
  }

  lobby.currentQuestion = {
    id: questionId,
    timer: {
      questionId,
      startTime: Date.now(),
      timeout: setTimeout(() => {
        // Time's up - move to next question or phase
        processQuestionEnd(lobby);
      }, 15000), // 15 seconds
    },
  };

  // Broadcast question start
  broadcast(lobby.code, {
    type: 'questionStart',
    questionId,
    timeRemaining: 15000,
  });
}

function processQuestionEnd(lobby) {
  if (!lobby.currentQuestion) return;

  const { id: questionId } = lobby.currentQuestion;

  if (lobby.phase === 'personal') {
    // Check if all personal questions are done
    if (checkAllAnswered(lobby, questionId)) {
      lobby.phase = 'preference';
      broadcast(lobby.code, { type: 'phaseChanged', phase: 'preference' });
      // Start first preference question...
    }
  } else if (lobby.phase === 'preference') {
    // Calculate vote results
    const votes = lobby.votes[questionId] || {};
    const counts = {};
    Object.values(votes).forEach((vote) => {
      counts[vote] = (counts[vote] || 0) + 1;
    });

    const winningOption = Object.entries(counts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];

    broadcast(lobby.code, {
      type: 'tally',
      questionId,
      winningOption,
      counts,
    });

    // If all preference questions done, move to results
    const allPreferenceQuestionsAnswered = Object.keys(lobby.votes).length >= 5; // Assuming 5 preference questions
    if (allPreferenceQuestionsAnswered) {
      lobby.phase = 'results_processing';
      broadcast(lobby.code, {
        type: 'phaseChanged',
        phase: 'results_processing',
      });

      // Simulate async trip planning
      setTimeout(() => {
        broadcast(lobby.code, {
          type: 'results',
          trips: [
            { title: 'Beach Paradise', imageUrl: 'beach.jpg', score: 0.9 },
            {
              title: 'Mountain Adventure',
              imageUrl: 'mountain.jpg',
              score: 0.8,
            },
            { title: 'City Explorer', imageUrl: 'city.jpg', score: 0.7 },
          ],
        });
      }, 2000);
    }
  }
}

wss.on('connection', (ws) => {
  const playerId = uuidv4();
  connections.set(playerId, { ws, lobbyCode: null });

  ws.on('message', (data) => {
    let message;
    try {
      message = JSON.parse(data);
    } catch (e) {
      ws.send(
        JSON.stringify({ type: 'error', message: 'Invalid message format' })
      );
      return;
    }

    const connection = connections.get(playerId);
    const lobbyCode = connection?.lobbyCode;
    const lobby = lobbyCode ? lobbies.get(lobbyCode) : null;

    switch (message.type) {
      case 'create': {
        const code = generateLobbyCode();
        const lobby = {
          code,
          hostId: playerId,
          phase: 'waiting',
          players: {
            [playerId]: { ws, name: message.name, isHost: true },
          },
          answers: {},
          votes: {},
          currentQuestion: null,
        };

        lobbies.set(code, lobby);
        connections.get(playerId).lobbyCode = code;

        ws.send(
          JSON.stringify({
            type: 'created',
            lobbyCode: code,
            playerId,
            players: [
              {
                playerId,
                name: message.name,
                isHost: true,
              },
            ],
          })
        );
        break;
      }

      case 'join': {
        const lobby = lobbies.get(message.lobbyCode);
        if (!lobby) {
          ws.send(
            JSON.stringify({
              type: 'error',
              message: 'Lobby not found',
            })
          );
          return;
        }

        if (lobby.phase !== 'waiting') {
          ws.send(
            JSON.stringify({
              type: 'error',
              message: 'Game already started',
            })
          );
          return;
        }

        lobby.players[playerId] = {
          ws,
          name: message.name,
          isHost: false,
        };
        connections.get(playerId).lobbyCode = message.lobbyCode;

        // Send current lobby state to new player
        ws.send(
          JSON.stringify({
            type: 'joined',
            lobbyCode: message.lobbyCode,
            playerId,
            players: Object.entries(lobby.players).map(([id, p]) => ({
              playerId: id,
              name: p.name,
              isHost: p.isHost,
            })),
          })
        );

        // Broadcast new player to others
        broadcast(
          message.lobbyCode,
          {
            type: 'playerJoined',
            player: {
              playerId,
              name: message.name,
              isHost: false,
            },
          },
          playerId
        );
        break;
      }

      case 'startGame': {
        if (!lobby || lobby.hostId !== playerId) {
          ws.send(
            JSON.stringify({
              type: 'error',
              message: 'Not authorized',
            })
          );
          return;
        }

        lobby.phase = 'personal';
        broadcast(lobbyCode, { type: 'phaseChanged', phase: 'personal' });
        // Start first question...
        startQuestionTimer(lobby, 'personal_1');
        break;
      }

      case 'answer': {
        if (!lobby || !message.questionId) return;

        if (!lobby.answers[message.questionId]) {
          lobby.answers[message.questionId] = {};
        }

        lobby.answers[message.questionId][playerId] = message.answer;

        if (checkAllAnswered(lobby, message.questionId)) {
          processQuestionEnd(lobby);
        }
        break;
      }

      case 'vote': {
        if (!lobby || !message.questionId) return;

        if (!lobby.votes[message.questionId]) {
          lobby.votes[message.questionId] = {};
        }

        lobby.votes[message.questionId][playerId] = message.answer;

        if (checkAllAnswered(lobby, message.questionId)) {
          processQuestionEnd(lobby);
        }
        break;
      }
    }
  });

  ws.on('close', () => {
    handleDisconnect(playerId);
  });
});

console.log(`WebSocket server is running on port ${port}`);
