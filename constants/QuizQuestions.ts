export type QuizOption = {
  label: string;
  image: '/assets/images/alex.png' | '/assets/images/eric.png';
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
      image: '/assets/images/eric.png',
    },
    optionRight: {
      label: 'City',
      image: '/assets/images/eric.png',
    },
  },
  {
    id: '2',
    question: 'Do you like...',
    optionLeft: {
      label: 'Cold',
      image: '/assets/images/alex.png',
    },
    optionRight: {
      label: 'Hot',
      image: '/assets/images/alex.png',
    },
  },
  {
    id: '3',
    question: 'Do you prefer...',
    optionLeft: {
      label: 'Mountains',
      image: '/assets/images/eric.png',
    },
    optionRight: {
      label: 'Beach',
      image: '/assets/images/alex.png',
    },
  },
  {
    id: '4',
    question: 'Do you like...',
    optionLeft: {
      label: 'Coffee',
      image: '/assets/images/alex.png',
    },
    optionRight: {
      label: 'Tea',
      image: '/assets/images/eric.png',
    },
  },
  {
    id: '5',
    question: 'Do you prefer...',
    optionLeft: {
      label: 'Cats',
      image: '/assets/images/alex.png',
    },
    optionRight: {
      label: 'Dogs',
      image: '/assets/images/eric.png',
    },
  },

];
