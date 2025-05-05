import { GroupDestination } from '@/constants/types';

export type Phase =
  | 'waiting'
  | 'personal'
  | 'preference'
  | 'results_processing'
  | 'countdown'
  | 'done';

export interface TripState {
  phase: Phase;
  progress: number;
  memberPreferences: Record<string, boolean>;
  membersAnswers: {
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
  selectedDestination: GroupDestination | null;
  destinationImage: string | null;
  setPhase: (phase: Phase) => void;
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
  setSelectedDestination: (destination: GroupDestination | null) => void;
  getSelectedDestination: () => GroupDestination | null;
  setDestinationImage: (url: string | null) => void;
  getDestinationImage: () => string | null;
  setMembersAnswers: (answers: {
    quizAnswers: Record<string, string[]>;
    phase1Answers: Record<
      string,
      {
        originAirport: string;
        budget: number;
        hasLicense: boolean;
      }
    >;
  }) => void;
  getMembersAnswers: () => {
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
}
