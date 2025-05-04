import { Images } from './ImageAssets';

export type QuizOption = {
  label: string;
  image: keyof typeof Images;
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
    question: 'What kind of weather do you prefer?',
    optionLeft: {
      label: 'Hot',
      image: 'hot'
    },
    optionRight: {
      label: 'Cold',
      image: 'cold'
    }
  },
  {
    id: '2',
    question: 'Choose your ideal vacation setting',
    optionLeft: {
      label: 'Mountain',
      image: 'mountain'
    },
    optionRight: {
      label: 'Beach',
      image: 'beach'
    }
  },
  {
    id: '3',
    question: 'What is your preferred activity style?',
    optionLeft: {
      label: 'Adventure',
      image: 'adventure'
    },
    optionRight: {
      label: 'Relaxation',
      image: 'relax'
    }
  },
  {
    id: '4',
    question: "Do you prefer...",
    optionLeft: {
      label: 'Modern City',
      image: 'modernCity'
    },
    optionRight: {
      label: 'Historic',
      image: 'historic'
    }   
  },
  {
    id: '5',
    question: "The food is important to you?",
    optionLeft: {
      label: 'No',
      image: 'fastFood'
    },
    optionRight: {
      label: 'Yes',
      image: 'goodFood'
    }
  },
  {
    id: '6',
    question: "Do you prefer...",
    optionLeft: {
      label: 'Party',
      image: 'party'
    },
    optionRight: {
      label: 'Sleep',
      image: 'sleep'
  }
}
];
