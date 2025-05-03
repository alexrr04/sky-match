export interface TripState {
  phase: number;
  progress: number;
  setPhase: (phase: number) => void;
  setProgress: (progress: number) => void;
}
