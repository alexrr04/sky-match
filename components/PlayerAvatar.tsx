import React from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

interface PlayerAvatarProps {
  name: string;
  index: number;
  totalPlayers: number;
  size?: number;
}

export const PlayerAvatar = ({
  name,
  index,
  totalPlayers,
  size = 60,
}: PlayerAvatarProps) => {
  // Calculate position on the arc
  const angle = index * (360 / totalPlayers) * (Math.PI / 180);
  const radius = 130; // Radius of the arc
  const x = Math.sin(angle) * radius;
  const y = Math.cos(angle) * radius;

  return (
    <Animated.View
      style={[
        styles.container,
        {
          left: '50%',
          top: '50%',
          transform: [
            { translateX: -size / 2 }, // Center the avatar itself
            { translateX: x }, // Apply circle position
            { translateY: -size / 2 }, // Center the avatar itself
            { translateY: y }, // Apply circle position
          ],
        },
      ]}
    >
      <View
        style={[
          styles.avatar,
          {
            width: size,
            height: size,
            borderRadius: size / 2,
          },
        ]}
      />
      <Text style={styles.name} numberOfLines={1}>
        {name}
      </Text>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    alignItems: 'center',
    width: 80,
    zIndex: 1,
  },
  avatar: {
    backgroundColor: '#A0A0A0',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  name: {
    marginTop: 8,
    fontSize: 12,
    color: '#000',
    textAlign: 'center',
  },
});
