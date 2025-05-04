import React from 'react';
import { Pressable, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from 'react-native-reanimated';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
  compact?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled,
  compact,
}) => {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (!disabled) {
      scale.value = withSpring(0.95, { 
        mass: 0.5,
        damping: 8,
        stiffness: 200
      });
    }
  };

  const handlePressOut = () => {
    if (!disabled) {
      scale.value = withSpring(1, {
        mass: 0.5,
        damping: 8,
        stiffness: 200
      });
    }
  };

  return (
    <AnimatedPressable
      style={[
        styles.button,
        compact && styles.compactButton,
        disabled && styles.disabledButton,
        animatedStyle
      ]}
      onPress={disabled ? undefined : onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      <Text style={[
        styles.text,
        compact && styles.compactText,
        disabled && styles.disabledText
      ]}>
        {label}
      </Text>
    </AnimatedPressable>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.primary,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 20,
    minWidth: 200,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    transform: [{ scale: 1 }],
  },
  compactButton: {
    paddingVertical: 10,
    paddingHorizontal: 24,
    minWidth: 160,
    marginBottom: 0,
  },
  disabledButton: {
    backgroundColor: Colors.light.disabled,
    elevation: 0,
    shadowOpacity: 0,
  },
  text: {
    color: Colors.light.buttonText,
    fontSize: 20,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  compactText: {
    fontSize: 16,
  },
  disabledText: {
    color: Colors.light.disabledText,
  },
});

export default PrimaryButton;
