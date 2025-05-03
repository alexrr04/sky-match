import React from 'react';
import { View, ActivityIndicator, StyleSheet, Dimensions } from 'react-native';
import { Colors } from '@/constants/Colors';
import { ThemedText } from './ThemedText';

type Props = {
  message?: string;
};

const { width } = Dimensions.get('window');

export const LoadingScreen: React.FC<Props> = ({ message = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={Colors.light.primary} />
      <ThemedText style={styles.loadingText}>{message}</ThemedText>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.light.background,
    padding: width * 0.05,
  },
  loadingText: {
    marginTop: 16,
    fontSize: 18,
    textAlign: 'center',
    color: Colors.light.primary,
  },
});
