<<<<<<< HEAD:client/app/(game)/index.tsx
import {
  View,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
=======
import { View, StyleSheet, Text, TextInput, TouchableOpacity, Dimensions } from 'react-native';
import React, { useEffect } from 'react';
>>>>>>> origin:app/(game)/index.tsx
import { Colors } from '@/constants/Colors';
import { useNavigate } from '@/hooks/useNavigate';
import { Image } from 'expo-image';
import PrimaryButton from '@/components/PrimaryButton';
<<<<<<< HEAD:client/app/(game)/index.tsx
=======
import { MaterialIcons } from '@expo/vector-icons';
import Animated, {
  useAnimatedStyle,
  withSpring,
  withTiming,
  withSequence,
  withRepeat,
  useSharedValue,
  withDelay,
  Easing,
} from 'react-native-reanimated';

const { width, height } = Dimensions.get('window');

const AnimatedImage = Animated.createAnimatedComponent(Image);
>>>>>>> origin:app/(game)/index.tsx

export default function MainScreen() {
  const { navigateTo } = useNavigate();
  const [showPopup, setShowPopup] = React.useState(false);
  const [groupCode, setGroupCode] = React.useState('');
  const [userName, setUserName] = React.useState('');

  // Animation values
  const logoScale = useSharedValue(0.8);
  const titleOpacity = useSharedValue(0);
  const buttonContainerOpacity = useSharedValue(0);
  const popupScale = useSharedValue(0);

  useEffect(() => {
    // Initial animations with single sequence
    logoScale.value = withSequence(
      withSpring(1, {
        mass: 1,
        damping: 12,
        stiffness: 100,
      }),
      withDelay(1000, 
        withSequence(
          withTiming(1.05, { duration: 2000, easing: Easing.inOut(Easing.ease) }),
          withTiming(1, { duration: 2000, easing: Easing.inOut(Easing.ease) })
        )
      )
    );
    titleOpacity.value = withDelay(400, withTiming(1, { duration: 800 }));
    buttonContainerOpacity.value = withDelay(800, withTiming(1, { duration: 800 }));
  }, []);

  useEffect(() => {
    if (showPopup) {
      popupScale.value = withSpring(1);
    } else {
      popupScale.value = withTiming(0);
    }
  }, [showPopup]);

  const logoStyle = useAnimatedStyle(() => ({
    transform: [{ scale: logoScale.value }],
  }));

  const titleStyle = useAnimatedStyle(() => ({
    opacity: titleOpacity.value,
    transform: [
      { translateY: withTiming(titleOpacity.value * -20, { duration: 800 }) },
    ],
  }));

  const buttonContainerStyle = useAnimatedStyle(() => ({
    opacity: buttonContainerOpacity.value,
    transform: [
      { translateY: withTiming(buttonContainerOpacity.value * -20, { duration: 800 }) },
    ],
  }));

  const popupStyle = useAnimatedStyle(() => ({
    transform: [{ scale: popupScale.value }],
    opacity: popupScale.value,
  }));

  const handleCreateGroup = () => {
    navigateTo('/create-group');
  };

  const handleJoinGroup = () => {
    setShowPopup(true);
  };

  const handleConfirmGroupCode = () => {
    navigateTo('/lobby');
  };

  return (
    <View style={styles.container}>
      <AnimatedImage
        source={require('@/assets/images/logo-no-bg.png')}
        style={[styles.logo, logoStyle]}
        contentFit="contain"
      />
<<<<<<< HEAD:client/app/(game)/index.tsx
      <Text style={styles.text}>SkyMatch</Text>
      {showPopup && (
        <View style={styles.popup}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setShowPopup(false)}
          >
            <Text style={styles.closeButtonText}>×</Text>
          </TouchableOpacity>
          <Text style={styles.popupText}>Enter your name:</Text>
=======
      
      <Animated.Text style={[styles.text, titleStyle]}>
        SkyMatch
      </Animated.Text>

      <Animated.View style={[styles.popup, popupStyle, showPopup && styles.popupVisible]}>
        <TouchableOpacity 
          style={styles.closeButton} 
          onPress={() => setShowPopup(false)}
        >
          <MaterialIcons name="close" size={24} color="#fff" />
        </TouchableOpacity>

        <Text style={styles.popupTitle}>Join a Group</Text>
        
        <View style={styles.inputContainer}>
          <MaterialIcons name="person" size={24} color={Colors.light.primary} />
>>>>>>> origin:app/(game)/index.tsx
          <TextInput
            style={styles.input}
            value={userName}
            onChangeText={setUserName}
<<<<<<< HEAD:client/app/(game)/index.tsx
            placeholder="Name"
            placeholderTextColor={Colors.light.placeholder}
          />
          <Text style={styles.popupText}>Enter Group Code:</Text>
=======
            placeholder="Enter your name"
            placeholderTextColor={Colors.light.placeholder}
          />
        </View>

        <View style={styles.inputContainer}>
          <MaterialIcons name="groups" size={24} color={Colors.light.primary} />
>>>>>>> origin:app/(game)/index.tsx
          <TextInput
            style={styles.input}
            value={groupCode}
            onChangeText={setGroupCode}
<<<<<<< HEAD:client/app/(game)/index.tsx
            placeholder="Group Code"
            placeholderTextColor={Colors.light.placeholder}
          />
          <PrimaryButton
            label="Join"
            onPress={handleConfirmGroupCode}
            disabled={!userName || !groupCode}
          />
        </View>
      )}
      <View style={[styles.buttonContainer, showPopup && styles.dimmed]}>
        <PrimaryButton
          label="Create Group"
          onPress={handleCreateGroup}
=======
            placeholder="Enter group code"
            placeholderTextColor={Colors.light.placeholder}
          />
        </View>

        <PrimaryButton 
          label="Join Group" 
          onPress={handleConfirmGroupCode} 
          disabled={!userName || !groupCode}
        />
      </Animated.View>

      <Animated.View style={[styles.buttonContainer, buttonContainerStyle, showPopup && styles.dimmed]}>
        <PrimaryButton 
          label="Create Group" 
          onPress={handleCreateGroup} 
>>>>>>> origin:app/(game)/index.tsx
          disabled={showPopup}
        />
        <PrimaryButton
          label="Join Group"
          onPress={handleJoinGroup}
          disabled={showPopup}
        />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: Colors.light.background,
    alignItems: 'center',
    padding: width * 0.05,
  },
  dimmed: {
    opacity: 0.05,
  },
  logo: {
    width: Math.min(width * 0.8, 300),
    height: Math.min(width * 0.8, 300),
    marginBottom: -height * 0.06, // Negative margin to compensate for the PNG's built-in margin
  },
  text: {
    fontSize: Math.min(width * 0.12, 48),
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    marginBottom: height * 0.2, // Increased spacing between title and buttons
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    gap: height * 0.02,
    paddingHorizontal: width * 0.1,
    zIndex: 2,
  },
  popup: {
    position: 'absolute',
    width: '85%',
    backgroundColor: '#fff',
    padding: width * 0.06,
    borderRadius: 20,
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    zIndex: 3,
  },
  popupVisible: {
    display: 'flex',
  },
  popupTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    marginBottom: height * 0.03,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    backgroundColor: Colors.light.background,
    borderRadius: 12,
    marginBottom: height * 0.02,
    padding: width * 0.04,
    borderWidth: 1,
    borderColor: Colors.light.secondary,
  },
  input: {
    flex: 1,
    marginLeft: width * 0.03,
    fontSize: 16,
    color: Colors.light.primaryText,
  },
  closeButton: {
    position: 'absolute',
    top: -width * 0.03,
    right: -width * 0.03,
    width: width * 0.1,
    height: width * 0.1,
    borderRadius: width * 0.05,
    backgroundColor: Colors.light.primary,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});
