import React from 'react';
import { View, Text, StyleSheet, Image, Dimensions } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

type Props = {
  name: string;
  isHost?: boolean;
};

const screenWidth = Dimensions.get('window').width;

export const GroupMemberCard: React.FC<Props> = ({ name, isHost = false }) => {
  return (
    <View style={styles.card}>
      {/* Nombre del usuario */}
      <Text style={styles.name}>{name}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: screenWidth - 32,
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333333',
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  crown: {
    marginLeft: 6,
  },
});
