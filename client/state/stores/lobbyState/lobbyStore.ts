import { create } from 'zustand';

interface Player {
  playerId: string;
  name: string;
  isHost: boolean;
}

type Phase =
  | 'waiting'
  | 'personal'
  | 'preference'
  | 'results_processing'
  | 'done';

interface Question {
  id: string;
  timeRemaining: number;
}

interface LobbyState {
  lobbyCode: string | null;
  playerId: string | null;
  players: Player[];
  phase: Phase;
  currentQuestion: Question | null;
  hasAnswered: boolean;
  send: (msg: any) => void;
  // Actions
  setLobbyCode: (code: string | null) => void;
  setPlayerId: (id: string | null) => void;
  setPlayers: (players: Player[] | ((current: Player[]) => Player[])) => void;
  addPlayer: (player: Player) => void;
  removePlayer: (playerId: string) => void;
  setPhase: (phase: Phase) => void;
  setCurrentQuestion: (
    question: Question | null | ((current: Question | null) => Question | null)
  ) => void;
  setHasAnswered: (answered: boolean) => void;
  setSend: (send: (msg: any) => void) => void;
  reset: () => void;
}

const initialState = {
  lobbyCode: null,
  playerId: null,
  players: [],
  phase: 'waiting' as Phase,
  currentQuestion: null,
  hasAnswered: false,
  send: () => {},
};

export const useLobbyStore = create<LobbyState>()((set) => ({
  ...initialState,

  setLobbyCode: (code) => set({ lobbyCode: code }),
  setPlayerId: (id) => set({ playerId: id }),
  setPlayers: (players) =>
    set((state) => ({
      players: typeof players === 'function' ? players(state.players) : players,
    })),
  addPlayer: (player) =>
    set((state) => ({
      players: [...state.players, player],
    })),
  removePlayer: (playerId) =>
    set((state) => ({
      players: state.players.filter((p) => p.playerId !== playerId),
    })),
  setPhase: (phase) => set({ phase }),
  setCurrentQuestion: (question) =>
    set((state) => ({
      currentQuestion:
        typeof question === 'function'
          ? question(state.currentQuestion)
          : question,
    })),
  setHasAnswered: (answered) => set({ hasAnswered: answered }),
  setSend: (send) => set({ send }),
  reset: () => set(initialState),
}));
