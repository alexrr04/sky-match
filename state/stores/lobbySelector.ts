import { useLobbyStore } from './lobbyStore';
import { LobbyState } from '@/state/stores/lobbyState';
import { useEffect, useState } from 'react';

type LobbyStateKeys = keyof LobbyState;
type LobbyStateActions = {
  [K in LobbyStateKeys]: LobbyState[K] extends Function ? K : never;
}[LobbyStateKeys];

/**
 * Hook to get a reactive value from the lobby state.
 * @param key The key of the state attribute to select.
 * @returns The latest value of the specified attribute from the lobby state.
 * @example
 * const currentLobbyIndex = useLobbyStateReactive('currentLobbyIndex');
 */
export function useLobbyStateReactive<K extends LobbyStateKeys>(
  key: K
): LobbyState[K] {
  const [state, setState] = useState(() => useLobbyStore.getState()[key]);

  useEffect(() => {
    const unsubscribe = useLobbyStore.subscribe((newState) =>
      setState(newState[key])
    );
    return unsubscribe;
  }, [key]);

  return state;
}

/**
 * Function to get the current value from the lobby state (non-reactive).
 * @param key The key of the state attribute to select.
 * @returns The current value of the specified attribute from the lobby state.
 * @example
 * const currentIndex = getLobbyStateValue('currentLobbyIndex');
 */
export function getLobbyStateValue<K extends LobbyStateKeys>(
  key: K
): LobbyState[K] {
  return useLobbyStore.getState()[key];
}

/**
 * Hook to get an lobby state action.
 * @param action The name of the action to get.
 * @returns The action function from the lobby state.
 * @example
 * const setLobbyIndex = useLobbyStateAction('setCurrentLobbyIndex');
 * setLobbyIndex(1);
 */
export function useLobbyStateAction<T extends LobbyStateActions>(
  action: T
): LobbyState[T] {
  return useLobbyStore((state) => state[action]);
}
