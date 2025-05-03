import { useState, useEffect } from 'react';
import { Image } from 'react-native';
import { Images } from '@/constants/ImageAssets';
import { quizQuestions } from '@/constants/QuizQuestions';
import * as SplashScreen from 'expo-splash-screen';

// Keep the splash screen visible while we fetch resources
SplashScreen.preventAutoHideAsync();

const preloadImage = async (imageKey: string, image: any) => {
  return new Promise((resolve, reject) => {
    const uri = Image.resolveAssetSource(image).uri;
    Image.prefetch(uri)
      .then(() => {
        console.log(`Preloaded: ${imageKey}`);
        resolve(true);
      })
      .catch((error) => {
        console.warn(`Failed to preload ${imageKey}:`, error);
        // Resolve anyway to not block the app
        resolve(false);
      });
  });
};

export const useAppInitialization = () => {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Get unique images from all questions
        const quizImages = new Set(quizQuestions.flatMap(question => [
          question.optionLeft.image,
          question.optionRight.image
        ]));

        // Pre-load all images in parallel
        const preloadPromises = [
          // Load quiz images
          ...Array.from(quizImages).map(imageKey => 
            preloadImage(imageKey, Images[imageKey])
          ),
          // Load any additional app images if needed
          // Add them here if necessary
        ];

        // Wait for all images to be loaded
        await Promise.all(preloadPromises);
        console.log('All app resources loaded successfully');
      } catch (e) {
        console.warn('Error loading app resources:', e);
      } finally {
        // Set app as ready even if some images failed
        setAppIsReady(true);
        await SplashScreen.hideAsync().catch(console.warn);
      }
    }

    prepare();
  }, []);

  return appIsReady;
};
