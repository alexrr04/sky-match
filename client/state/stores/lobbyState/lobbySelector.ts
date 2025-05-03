import { useLobbyStore } from './lobbyStore';
import { LobbyState } from '@/state/stores/lobbyState/lobbyState';
import { useEffect, useState } from 'react';

type LobbyStateKeys = keyof LobbyState;
type LobbyStateActions = {
  [K in LobbyStateKeys]: LobbyState[K] extends (...args: any) => any
    ? K
    : never;
}[LobbyStateKeys];

/** Reactive read of any scalar in the lobby store */
export function useLobbyStateReactive<K extends LobbyStateKeys>(
  key: K
): LobbyState[K] {
  const [value, setValue] = useState(
    () => (useLobbyStore.getState() as any)[key] as LobbyState[K]
  );

  useEffect(() => {
    const unsub = useLobbyStore.subscribe((s, _prev) => {
      setValue((s as any)[key] as LobbyState[K]);
    });
    return unsub;
  }, [key]);

  return value;
}

/** Non‑reactive getter */
export function getLobbyStateValue<K extends LobbyStateKeys>(
  key: K
): LobbyState[K] {
  return (useLobbyStore.getState() as any)[key] as LobbyState[K];
}

/** Retrieve an action from the store */
export function useLobbyStateAction<T extends LobbyStateActions>(
  action: T
): LobbyState[T] {
  return getLobbyStateValue(action);
}
