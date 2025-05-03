export type QuizOption = {
  label: string;
  image: '/assets/images/alex.png' | '/assets/images/eric.png' | '/assets/images/beach.png' | '/assets/images/mountain.png' | '/assets/images/cold.png' | '/assets/images/hot.png' | '/assets/images/historic.png' | '/assets/images/modernCity.png' | '/assets/images/relax.png' | '/assets/images/adventure.png' | '/assets/images/party.png';
};

export type QuizQuestion = {
  id: string;
  question: string;
  optionLeft: QuizOption;
  optionRight: QuizOption;
};

export const quizQuestions: QuizQuestion[] = [
  {
    id: '1',
    question: 'What do you prefer?',
    optionLeft: {
      label: 'Nature',
      image: require('@/assets/images/beach.png'),
    },
    optionRight: {
      label: 'City',
      image: require('@/assets/images/mountain.png'),
    },
  },
  {
    id: '2',
    question: 'Do you like...',
    optionLeft: {
      label: 'Cold',
      image: require('@/assets/images/cold.png'),
    },
    optionRight: {
      label: 'Hot',
      image: require('@/assets/images/hot.png'),
    },
  },
  {
    id: '3',
    question: 'Do you prefer...',
    optionLeft: {
      label: 'Mountains',
      image: require('@/assets/images/mountain.png'),
    },
    optionRight: {
      label: 'Beach',
      image: require('@/assets/images/beach.png'),
    },
  },
  {
    id: '4',
    question: 'Do you like...',
    optionLeft: {
      label: 'Adventure',
      image: require('@/assets/images/adventure.png'),
    },
    optionRight: {
      label: 'Relax',
      image: require('@/assets/images/relax.png'),
    },
  },
  {
    id: '5',
    question: 'Do you prefer...',
    optionLeft: {
      label: 'Historic',
      image: require('@/assets/images/historic.png'),
    },
    optionRight: {
      label: 'Modern',
      image: require('@/assets/images/modernCity.png'),
    },
  },

];
