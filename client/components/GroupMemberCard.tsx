import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Colors } from '@/constants/Colors';

type Props = {
  name: string;
  isHost?: boolean;
};

const screenWidth = Dimensions.get('window').width;

export const GroupMemberCard: React.FC<Props> = ({ name, isHost = false }) => {
  return (
    <View style={styles.card}>
      <Ionicons
        name="person"
        size={22}
        color="black"
        style={styles.personIcon}
      />

      <Text style={styles.name}>{name}</Text>

      {isHost && (
        <MaterialCommunityIcons
          name="crown"
          size={24}
          color="black"
          style={styles.crown}
        />
      )}
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
    color: Colors.light.primaryText,
    flex: 1,
  },
  personIcon: {
    marginRight: 10,
    color: Colors.light.neutralDark,
  },
  crown: {
    marginLeft: 6,
    color: '#FFD700',
  },
});
