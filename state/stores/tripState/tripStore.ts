import { create } from 'zustand';

import { TripState } from '@/state/stores/tripState/tripState';
import { tripStateLogger } from '@/state/stores/tripState/tripMiddleware';

export const useTripStore = create<TripState>(
  tripStateLogger({ showOnlyChanges: true })((set, get) => ({
    phase: 1,
    progress: 0,
    setPhase: (phase) => {
      set({ phase });
    },
    setProgress: (progress) => {
      set({ progress });
    },
    getPhase: () => get().phase,
    getProgress: () => get().progress,
  }))
);
