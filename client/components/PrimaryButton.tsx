import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Colors } from '@/constants/Colors';

interface PrimaryButtonProps {
  label: string;
  onPress: () => void;
  disabled?: boolean;
}

const PrimaryButton: React.FC<PrimaryButtonProps> = ({
  label,
  onPress,
  disabled,
}) => {
  return (
    <TouchableOpacity
      style={[styles.button, disabled && styles.disabledButton]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
    >
      <Text style={[styles.text, disabled && styles.disabledText]}>
        {label}
      </Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.light.primary,
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  disabledButton: {
    backgroundColor: Colors.light.disabled,
  },
  text: {
    color: Colors.light.buttonText,
    fontSize: 24,
    fontWeight: 'bold',
  },
  disabledText: {
    color: Colors.light.disabledText,
  },
});

export default PrimaryButton;
