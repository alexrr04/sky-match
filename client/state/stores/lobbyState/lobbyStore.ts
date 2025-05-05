import { create } from 'zustand';
import { Phase } from '@/state/stores/tripState/tripState';

export interface Player {
  playerId: string;
  name: string;
  isHost: boolean;
}

interface Question {
  id: string;
  timeRemaining: number;
}

interface LobbyState {
  lobbyCode: string | null;
  playerId: string | null;
  players: Player[];
  phase: Phase;
  isHost: boolean;
  currentQuestion: Question | null;
  hasAnswered: boolean;
  send: (msg: any) => void;
  membersAnswers?: {
    quizAnswers: Record<string, string[]>;
    phase1Answers: Record<
      string,
      {
        originAirport: string;
        budget: number;
        hasLicense: boolean;
      }
    >;
  };
  selectedDestination: string | null;
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
  setMembersAnswers: (answers: LobbyState['membersAnswers']) => void;
  getMembersAnswers: () => LobbyState['membersAnswers'];
  setSelectedDestination: (destination: string | null) => void;
}

export const useLobbyStore = create<LobbyState>()((set, get) => ({
  lobbyCode: null,
  playerId: null,
  players: [],
  phase: 'waiting' as Phase,
  isHost: false,
  currentQuestion: null,
  hasAnswered: false,
  send: () => {},
  membersAnswers: undefined,
  selectedDestination: null,

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
  reset: () => set({}),
  setMembersAnswers: (answers) => set({ membersAnswers: answers }),
  getMembersAnswers: () => get().membersAnswers,
  setSelectedDestination: (destination) =>
    set({ selectedDestination: destination }),
}));
