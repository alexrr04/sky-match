import { create } from 'zustand';

import { LobbyState } from '@/state/stores/lobbyState';
import { lobbyStateLogger } from '@/state/stores/lobbyMiddleware';

export const useLobbyStore = create<LobbyState>(
  lobbyStateLogger({ showOnlyChanges: true })((set, get) => ({
    hostName: '',
    lobbyId: '',
    playersNames: [],
    addPlayer: (name) => {
      set((state) => ({
        playersNames: [...state.playersNames, name],
      }));
    },
    removePlayer: (name) => {
      set((state) => ({
        playersNames: state.playersNames.filter((player) => player !== name),
      }));
    },
    setHost: (name) => {
      set({ hostName: name });
    },
    setLobbyId: (id) => {
      set({ lobbyId: id });
    },
    getLobbyId: () => get().lobbyId,
    getHostName: () => get().hostName,
    getPlayerCount: () => get().playersNames.length,
    getPlayersNames: () => get().playersNames,
  }))
);
