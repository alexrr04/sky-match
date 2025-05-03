import { useEffect, useCallback } from 'react';
import { useNavigate } from '@/hooks/useNavigate';
import { useLobbyStore } from '@/state/stores/lobbyState/lobbyStore';

const WS_URL = 'ws://localhost:8080';

interface Player {
  playerId: string;
  name: string;
  isHost: boolean;
}

interface Question {
  id: string;
  timeRemaining: number;
}

export const useLobby = () => {
  const { navigateTo } = useNavigate();
  const {
    setLobbyCode,
    setPlayerId,
    setPlayers,
    addPlayer,
    removePlayer,
    setPhase,
    setCurrentQuestion,
    setHasAnswered,
    setSend,
    reset,
  } = useLobbyStore();

  const connect = useCallback(() => {
    const ws = new WebSocket(WS_URL);

    ws.onopen = () => {
      console.log('Connected to WebSocket server');
      setSend((msg: any) => ws.send(JSON.stringify(msg)));
    };

    ws.onclose = () => {
      console.log('Disconnected from WebSocket server');
      reset();
    };

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data);

        switch (message.type) {
          case 'created':
            setLobbyCode(message.lobbyCode);
            setPlayerId(message.playerId);
            setPlayers(message.players);
            navigateTo('/lobby');
            break;

          case 'joined':
            setLobbyCode(message.lobbyCode);
            setPlayerId(message.playerId);
            setPlayers(message.players);
            navigateTo('/lobby');
            break;

          case 'error':
            // Handle error (could display toast/alert)
            console.error('Server error:', message.message);
            break;

          case 'playerJoined':
            addPlayer(message.player);
            break;

          case 'playerLeft':
            removePlayer(message.playerId);
            break;

          case 'hostChanged':
            setPlayers((current: Player[]) =>
              current.map((p: Player) => ({
                ...p,
                isHost: p.playerId === message.newHostId,
              }))
            );
            break;

          case 'phaseChanged':
            setPhase(message.phase);
            if (
              message.phase === 'personal' ||
              message.phase === 'preference'
            ) {
              navigateTo('/in-game');
            }
            break;

          case 'questionStart':
            setCurrentQuestion({
              id: message.questionId,
              timeRemaining: message.timeRemaining,
            });
            setHasAnswered(false);
            break;

          case 'timeUpdate':
            setCurrentQuestion((current: Question | null): Question | null =>
              current
                ? { ...current, timeRemaining: message.timeRemaining }
                : null
            );
            break;

          case 'tally':
            // Handle tally results
            // Could emit an event or update state with results
            console.log('Question results:', message);
            break;

          case 'results':
            navigateTo('/end-game', 'replace', { trips: message.trips });
            break;
        }
      } catch (error) {
        console.error('Error processing message:', error);
      }
    };

    return () => {
      ws.close();
    };
  }, [
    navigateTo,
    setLobbyCode,
    setPlayerId,
    setPlayers,
    addPlayer,
    removePlayer,
    setPhase,
    setCurrentQuestion,
    setHasAnswered,
    setSend,
    reset,
  ]);

  useEffect(() => {
    const cleanup = connect();
    return cleanup;
  }, [connect]);

  return useLobbyStore();
};
