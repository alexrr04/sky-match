export interface MemberPreferences {
  [key: string]: string | number | boolean;
  name: string;
  originAirport: string;
  budget: number;
  Relax: boolean;
  Adventure: boolean;
  Cold: boolean;
  Hot: boolean;
  Beach: boolean;
  Mountain: boolean;
  'Modern City': boolean;
  Historic: boolean;
  Nightlife: boolean;
  'Quiet evenings': boolean;
  'Good food': boolean;
}

export interface Phase1Data {
  originAirport: string;
  budget: number;
  hasLicense: boolean;
}

export interface QuizAnswer {
  questionId: string;
  choice: 'left' | 'right';
}

import { GroupDestination } from '@/constants/types';

export interface TripState {
  departureDate: string;
  returnDate: string;
  phase: number;
  progress: number;
  phase1Data: Phase1Data | null;
  quizAnswers: QuizAnswer[];
  memberPreferences: MemberPreferences | null;
  selectedDestination: GroupDestination | null;
  destinationImage: string | null;
  setDepartureDate: (date: string) => void;
  setReturnDate: (date: string) => void;
  getDepartureDate: () => string;
  getReturnDate: () => string;
  setPhase: (phase: number) => void;
  setProgress: (progress: number) => void;
  setPhase1Data: (data: Phase1Data) => void;
  addQuizAnswer: (answer: QuizAnswer) => void;
  transformAndStorePreferences: () => Promise<void>;
  getMemberPreferences: () => MemberPreferences | null;
  getSelectedDestination: () => GroupDestination | null;
  setDestinationImage: (url: string) => void;
  getDestinationImage: () => string | null;
  setSelectedDestination: (destination: GroupDestination) => void;
  reset: () => void;
}
