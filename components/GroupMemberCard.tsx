import React from 'react';
import { View, Text, StyleSheet, Dimensions, Platform } from 'react-native';
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
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.leftSection}>
          <Ionicons 
            name="person" 
            size={22} 
            color={Colors.light.neutralDark}
            style={styles.personIcon}
          />
          <Text style={styles.name}>{name}</Text>
        </View>

        {isHost && (
          <View style={styles.hostBadge}>
            <MaterialCommunityIcons 
              name="crown" 
              size={16} 
              color={Colors.light.background}
            />
            <Text style={styles.hostText}>Host</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 16,
    marginVertical: 6,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FEFEFF',
    borderRadius: 12,
    padding: 12,
    ...Platform.select({
      ios: {
        shadowColor: Colors.light.primary,
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  personIcon: {
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.light.primaryText,
    flex: 1,
  },
  hostBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.light.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  hostText: {
    color: Colors.light.background,
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4,
  },
});
