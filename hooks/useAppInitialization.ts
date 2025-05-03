import { useState, useEffect } from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';

import { createLogger } from '@/utils/logger';

const logger = createLogger('AppSetup');

function initializeSplashScreen() {
  SplashScreen.preventAutoHideAsync()
    .then(() => logger.started('Preventing auto-hide of splash screen...'))
    .catch((error) =>
      logger.error(`Failed to prevent auto-hide of splash screen:`, error)
    );
}

const fetchFonts = () =>
  Font.loadAsync({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

export function useAppInitialization() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        initializeSplashScreen();
        await fetchFonts();
        logger.success('Fonts loaded successfully.');
      } catch (e) {
        logger.error(`Error during app initialization: ${e}`);
      } finally {
        setAppIsReady(true);
      }
    }

    prepare();
  }, []);

  const onLayoutRootView = async () => {
    if (appIsReady) {
      await SplashScreen.hideAsync();
      logger.success('Splash screen hidden successfully.');
    }
  };

  return { appIsReady, onLayoutRootView };
}
