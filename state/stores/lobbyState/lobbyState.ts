export interface LobbyState {
  hostName: string;
  lobbyId: string;
  playersNames: string[];
  addPlayer: (name: string) => void;
  removePlayer: (name: string) => void;
  setHost: (name: string) => void;
  setLobbyId: (id: string) => void;
  getLobbyId: () => string;
  getHostName: () => string;
  getPlayerCount: () => number;
  getPlayersNames: () => string[];
}
