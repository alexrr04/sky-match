export interface TripState {
  phase: number;
  progress: number;
  memberPreferences: Record<string, boolean>;
  selectedDestination: string | null;
  destinationImage: string | null;
  setPhase: (phase: number) => void;
  setProgress: (progress: number) => void;
  getPhase: () => number;
  getProgress: () => number;
  setPhase1Data: (data: {
    originAirport: string;
    budget: number;
    hasLicense: boolean;
  }) => void;
  setMemberPreferences: (preferences: Record<string, boolean>) => void;
  getMemberPreferences: () => Record<string, boolean>;
  setSelectedDestination: (destination: string | null) => void;
  getSelectedDestination: () => string | null;
  setDestinationImage: (url: string | null) => void;
  getDestinationImage: () => string | null;
}
