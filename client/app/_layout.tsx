import { Stack } from 'expo-router';
import { View } from 'react-native';
import { useAppInitialization } from '@/hooks/useAppInitialization';
import { Colors } from '@/constants/Colors';

export default function RootLayout() {
  const isReady = useAppInitialization();

  if (!isReady) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.light.background }} />
    );
  }

  return (
    <Stack 
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: Colors.light.background }
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen 
        name="(game)/quiz" 
        options={{
          animation: 'fade',
        }}
      />
      <Stack.Screen 
        name="(game)/in-game" 
        options={{
          animation: 'slide_from_right',
          gestureEnabled: false
        }}
      />
      <Stack.Screen 
        name="(game)/end-game" 
        options={{
          animation: 'slide_from_right',
          gestureEnabled: false
        }}
      />
    </Stack>
  );
}
