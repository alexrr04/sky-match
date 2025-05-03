import { create } from 'zustand';
import { Phase1Data, QuizAnswer, MemberPreferences, TripState } from './types';
import { useLobbyStore } from '../lobbyState/lobbyStore';

export const useTripStore = create<TripState>((set, get) => ({
  phase: 0,
  progress: 0,
  phase1Data: null,
  quizAnswers: [],
  memberPreferences: null,

  setPhase: (phase: number) => set({ phase }),
  setProgress: (progress: number) => set({ progress }),
  
  setPhase1Data: (data: Phase1Data) => set({ phase1Data: data }),
  
  addQuizAnswer: (answer: QuizAnswer) => {
    const currentAnswers = get().quizAnswers;
    set({ quizAnswers: [...currentAnswers, answer] });
  },

  transformAndStorePreferences: () => {
    const { phase1Data, quizAnswers } = get();
    if (!phase1Data || quizAnswers.length < 6) return;

    const preferences: MemberPreferences = {
      name: useLobbyStore.getState().getHostName(),
      originAirport: phase1Data.originAirport,
      budget: phase1Data.budget,
      Relax: quizAnswers[2].choice === 'right',
      Adventure: quizAnswers[2].choice === 'left',
      Cold: quizAnswers[0].choice === 'right',
      Hot: quizAnswers[0].choice === 'left',
      Beach: quizAnswers[1].choice === 'right',
      Mountain: quizAnswers[1].choice === 'left',
      "Modern City": quizAnswers[3].choice === 'left',
      Historic: quizAnswers[3].choice === 'right',
      Nightlife: quizAnswers[5].choice === 'left',
      "Quiet evenings": quizAnswers[5].choice === 'right',
      "Good food": quizAnswers[4].choice === 'right'
    };

    console.log('Member Preferences:', preferences);
    set({ memberPreferences: preferences });
  },

  getMemberPreferences: () => get().memberPreferences
}));
