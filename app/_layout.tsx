import { Stack } from 'expo-router';
import { View, BackHandler } from 'react-native';
import 'react-native-reanimated';
import { useEffect } from 'react';

import { useAppInitialization } from '@/hooks/useAppInitialization';

export default function RootLayout() {
  const { appIsReady, onLayoutRootView } = useAppInitialization();

  useEffect(() => {
    const backAction = () => {
      // Custom back action logic
      return true; // Return true to prevent default back behavior
    };

    const backHandler = BackHandler.addEventListener(
      'hardwareBackPress',
      backAction
    );

    return () => backHandler.remove();
  }, []);

  if (!appIsReady) return null;

  return (
    <View style={{ flex: 1 }} onLayout={onLayoutRootView}>
      <Stack screenOptions={{ headerShown: false, gestureEnabled: false }}>
        <Stack.Screen
          name="index" // Main screen (game)/index.tsx
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </View>
  );
}
