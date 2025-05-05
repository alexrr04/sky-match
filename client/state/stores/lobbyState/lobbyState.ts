import { Player } from './lobbyStore';

type Phase =
  | 'waiting'
  | 'personal'
  | 'preference'
  | 'results_processing'
  | 'countdown'
  | 'done';

interface Question {
  id: string;
  timeRemaining: number;
}

export interface LobbyState {
  lobbyCode: string | null;
  playerId: string | null;
  players: Player[];
  isHost: boolean;
  phase: Phase;
  currentQuestion: Question | null;
  hasAnswered: boolean;
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
  setMembersAnswers: (answers: LobbyState['membersAnswers']) => void;
  getMembersAnswers: () => LobbyState['membersAnswers'];
  setSelectedDestination: (destination: string | null) => void;
}
