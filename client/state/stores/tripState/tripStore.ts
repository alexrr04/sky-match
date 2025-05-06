import { create } from 'zustand';
import { Phase1Data, QuizAnswer, MemberPreferences, TripState } from './types';
import { useLobbyStore } from '../lobbyState/lobbyStore';
import { findBestMatchingDestinations } from '@/scripts/destinationMatcher';
import { searchCityPhotos } from '@/services/PexelsService';
import { GroupInput, GroupDestination } from '@/constants/types';

export const useTripStore = create<TripState>((set, get) => ({
  departureDate: '',
  returnDate: '',
  phase: 0,
  progress: 0,
  phase1Data: null,
  quizAnswers: [],
  memberPreferences: null,
  selectedDestination: null as GroupDestination | null,
  destinationImage: null,

  setDepartureDate: (date: string) => set({ departureDate: date }),
  setReturnDate: (date: string) => set({ returnDate: date }),
  setPhase: (phase: number) => set({ phase }),
  setProgress: (progress: number) => set({ progress }),

  setPhase1Data: (data: Phase1Data) => set({ phase1Data: data }),

  addQuizAnswer: (answer: QuizAnswer) => {
    const currentAnswers = get().quizAnswers;
    set({ quizAnswers: [...currentAnswers, answer] });
  },

  transformAndStorePreferences: async () => {
    const { phase1Data, quizAnswers } = get();
    if (!phase1Data || quizAnswers.length < 6) {
      console.error('Missing required data:', {
        phase1Data,
        answersCount: quizAnswers.length,
      });
      throw new Error('Missing required data for preferences transformation');
    }

    const lobbyStore = useLobbyStore.getState();
    const preferences: MemberPreferences = {
      name: lobbyStore.players.find((p) => p.isHost)?.name || 'Host',
      originAirport: phase1Data.originAirport,
      budget: phase1Data.budget,
      Relax: quizAnswers[2].choice === 'right',
      Adventure: quizAnswers[2].choice === 'left',
      Cold: quizAnswers[0].choice === 'right',
      Hot: quizAnswers[0].choice === 'left',
      Beach: quizAnswers[1].choice === 'right',
      Mountain: quizAnswers[1].choice === 'left',
      'Modern City': quizAnswers[3].choice === 'left',
      Historic: quizAnswers[3].choice === 'right',
      Nightlife: quizAnswers[5].choice === 'left',
      'Quiet evenings': quizAnswers[5].choice === 'right',
      'Good food': quizAnswers[4].choice === 'right',
    };

    console.log('Member Preferences:', preferences);
    set({ memberPreferences: preferences });

    // Find matching destinations
    console.log('Finding matching destinations...');
    const group = {
      code: lobbyStore.lobbyCode || 'default',
      departureDate: '2025-07-15', // Hardcoded for now
      returnDate: '2025-07-22', // Hardcoded for now
      members: [preferences],
    };

    console.log('Group data:', group);
    const destinations = await findBestMatchingDestinations(group);
    console.log('Matching destinations found:', destinations);

    if (destinations.length > 0) {
      const winner = destinations[0];
      console.log('Winner destination:', winner);
      set({ selectedDestination: winner as GroupDestination });

      // Fetch destination image
      const cityName = winner.destination.split(' (')[0];
      const imageUrl = await searchCityPhotos(cityName);
      if (imageUrl) {
        set({ destinationImage: imageUrl });
      }
    }
  },

  getDepartureDate: () => get().departureDate,
  getReturnDate: () => get().returnDate,
  getMemberPreferences: () => get().memberPreferences,
  setSelectedDestination: (destination: GroupDestination | null) => {
    set({ selectedDestination: destination });
    if (destination) {
      const cityName = destination.destination.split(' (')[0];
      searchCityPhotos(cityName).then((url) => {
        if (url) {
          set({ destinationImage: url });
        }
      });
    }
  },
  getSelectedDestination: () => get().selectedDestination,
  setDestinationImage: (url: string) => set({ destinationImage: url }),
  getDestinationImage: () => get().destinationImage,
  reset: () =>
    set({
      departureDate: '',
      returnDate: '',
      phase: 0,
      progress: 0,
      phase1Data: null,
      quizAnswers: [],
      memberPreferences: null,
      selectedDestination: null,
      destinationImage: null,
    }),
}));
