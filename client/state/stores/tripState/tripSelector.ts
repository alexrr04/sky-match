import { useTripStore } from '@/state/stores/tripState/tripStore';
import { TripState } from '@/state/stores/tripState/tripState';
import { useEffect, useState } from 'react';

type TripStateKeys = keyof TripState;
type TripStateActions = {
  [K in TripStateKeys]: TripState[K] extends Function ? K : never;
}[TripStateKeys];

/**
 * Hook to get a reactive value from the trip state.
 * @param key The key of the state attribute to select.
 * @returns The latest value of the specified attribute from the trip state.
 * @example
 * const currentTripIndex = useTripStateReactive('currentTripIndex');
 */
export function useTripStateReactive<K extends TripStateKeys>(
  key: K
): TripState[K] {
  const [state, setState] = useState(() => useTripStore.getState()[key]);

  useEffect(() => {
    const unsubscribe = useTripStore.subscribe((newState) =>
      setState(newState[key])
    );
    return unsubscribe;
  }, [key]);

  return state;
}

/**
 * Function to get the current value from the trip state (non-reactive).
 * @param key The key of the state attribute to select.
 * @returns The current value of the specified attribute from the trip state.
 * @example
 * const currentIndex = getTripStateValue('currentTripIndex');
 */
export function getTripStateValue<K extends TripStateKeys>(
  key: K
): TripState[K] {
  return useTripStore.getState()[key];
}

/**
 * Hook to get a trip state action.
 * @param action The name of the action to get.
 * @returns The action function from the trip state.
 * @example
 * const setTripIndex = useTripStateAction('setCurrentTripIndex');
 * setTripIndex(1);
 */
export function useTripStateAction<T extends TripStateActions>(
  action: T
): TripState[T] {
  return useTripStore.getState()[action];
}
