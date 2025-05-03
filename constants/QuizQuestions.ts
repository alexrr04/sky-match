import { ImageAssets } from './ImageAssets';

export type QuizOption = {
  label: string;
  image:
    | typeof ImageAssets[keyof typeof ImageAssets]; // ← ahora es una imagen require()
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
      image: ImageAssets.beach,
    },
    optionRight: {
      label: 'City',
      image: ImageAssets.mountain,
    },
  },
  {
    id: '2',
    question: 'Do you like...',
    optionLeft: {
      label: 'Cold',
      image: ImageAssets.cold,
    },
    optionRight: {
      label: 'Hot',
      image: ImageAssets.hot,
    },
  },
  {
    id: '3',
    question: 'Do you prefer...',
    optionLeft: {
      label: 'Mountains',
      image: ImageAssets.mountain,
    },
    optionRight: {
      label: 'Beach',
      image: ImageAssets.beach,
    },
  },
  {
    id: '4',
    question: 'Do you like...',
    optionLeft: {
      label: 'Adventure',
      image: ImageAssets.adventure,
    },
    optionRight: {
      label: 'Relax',
      image: ImageAssets.relax,
    },
  },
  {
    id: '5',
    question: 'Do you prefer...',
    optionLeft: {
      label: 'Historic',
      image: ImageAssets.historic,
    },
    optionRight: {
      label: 'Modern',
      image: ImageAssets.modernCity,
    },
  },
];
