
export interface MemberPreferences {
  name: string;
  originAirport: string;
  budget: number;
  Relax: boolean;
  Adventure: boolean;
  Cold: boolean;
  Hot: boolean;
  Beach: boolean;
  Mountain: boolean;
  "Modern City": boolean;
  Historic: boolean;
  Nightlife: boolean;
  "Quiet evenings": boolean;
  "Good food": boolean;
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

export interface TripState {
  phase: number;
  progress: number;
  phase1Data: Phase1Data | null;
  quizAnswers: QuizAnswer[];
  memberPreferences: MemberPreferences | null;
  setPhase: (phase: number) => void;
  setProgress: (progress: number) => void;
  setPhase1Data: (data: Phase1Data) => void;
  addQuizAnswer: (answer: QuizAnswer) => void;
  transformAndStorePreferences: () => void;
  getMemberPreferences: () => MemberPreferences | null;
}
