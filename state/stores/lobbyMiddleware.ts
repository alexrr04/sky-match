import { StateCreator } from 'zustand';
import { createLogger } from '@/utils/logger';
import { deepDiff } from '@/utils/stateDiff';
import { LobbyState } from '@/state/stores/lobbyState';

const logger = createLogger('LobbyStateLogger');

interface LobbyStateLoggerOptions {
  showOnlyChanges: boolean;
}

export const lobbyStateLogger =
  (options: LobbyStateLoggerOptions = { showOnlyChanges: false }) =>
  (config: StateCreator<LobbyState>): StateCreator<LobbyState> =>
  (set, get, api) =>
    config(
      (args) => {
        const prevState = get();
        set(args);
        const newState = get();
        const changes = deepDiff(prevState, newState);

        if (changes) {
          if (options.showOnlyChanges) {
            logger.middleware(
              `State changes:\n${JSON.stringify(changes, null, 2)}`
            );
          } else {
            logger.middleware(
              `Previous state:\n${JSON.stringify(prevState, null, 2)}`
            );
            logger.middleware(
              `New state:\n${JSON.stringify(newState, null, 2)}`
            );
          }
        }
      },
      get,
      api
    );
