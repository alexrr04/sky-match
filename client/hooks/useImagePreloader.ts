import { useEffect, useState } from 'react';
import { Image, ImageRequireSource } from 'react-native';
import { Images } from '@/constants/ImageAssets';
import { quizQuestions } from '@/constants/QuizQuestions';

type ImageCache = {
  [key: string]: boolean;
};

const imageCache: ImageCache = {};

export const useImagePreloader = (currentIndex: number, totalQuestions: number) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [allImagesLoaded, setAllImagesLoaded] = useState(false);

  // Initial load of all quiz images
  useEffect(() => {
    const loadAllImages = async () => {
      try {
        // Get unique images from all questions
        const allImages = new Set(quizQuestions.flatMap(question => [
          question.optionLeft.image,
          question.optionRight.image
        ]));

        // Create promises for all images
        const imagePromises = Array.from(allImages).map(imageKey => {
          if (imageCache[imageKey]) {
            return Promise.resolve(true);
          }

          return new Promise((resolve, reject) => {
            const image: ImageRequireSource = Images[imageKey];
            if (!image) {
              reject(new Error(`Image not found: ${imageKey}`));
              return;
            }

            Image.prefetch(Image.resolveAssetSource(image).uri)
              .then(() => {
                imageCache[imageKey] = true;
                resolve(true);
              })
              .catch(error => {
                console.error(`Failed to preload image ${imageKey}:`, error);
                reject(error);
              });
          });
        });

        await Promise.all(imagePromises);
        console.log('All quiz images preloaded successfully');
        setAllImagesLoaded(true);
        setIsLoaded(true);
      } catch (error) {
        console.error('Failed to preload images:', error);
        // Even if some images fail, we'll set loaded to true to not block the app
        setAllImagesLoaded(true);
        setIsLoaded(true);
      }
    };

    if (!allImagesLoaded) {
      loadAllImages();
    }
  }, []);

  // Update loaded state when changing questions
  useEffect(() => {
    if (allImagesLoaded) {
      setIsLoaded(true);
    }
  }, [currentIndex, allImagesLoaded]);

  return isLoaded;
};

export const clearImageCache = () => {
  Object.keys(imageCache).forEach(key => {
    delete imageCache[key];
  });
};
