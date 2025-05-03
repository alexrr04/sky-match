import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import PrimaryButton from '@/components/PrimaryButton';
import { useNavigate } from '@/hooks/useNavigate';

export default function Phase1Quiz() {
  const [originAirport, setOriginAirport] = useState('');
  const [budget, setBudget] = useState('');
  const [hasLicense, setHasLicense] = useState(false);

  const { navigateTo } = useNavigate();

  const handleSubmit = () => {
    // TODO: Handle form submission
    navigateTo('/(game)/in-game');
  };

  const isFormValid = originAirport.trim() !== '' && budget.trim() !== '';

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Travel Preferences</Text>
      
      <View style={styles.inputContainer}>
        <MaterialIcons name="flight-takeoff" size={24} color={Colors.light.primary} />
        <TextInput
          style={styles.input}
          placeholder="Origin Airport (e.g., BCN)"
          placeholderTextColor={Colors.light.placeholder}
          value={originAirport}
          onChangeText={setOriginAirport}
          autoCapitalize="characters"
          maxLength={3}
        />
      </View>

      <View style={styles.inputContainer}>
        <MaterialIcons name="euro" size={24} color={Colors.light.primary} />
        <TextInput
          style={styles.input}
          placeholder="Budget in EUR"
          placeholderTextColor={Colors.light.placeholder}
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
        />
      </View>

      <View style={styles.licenseContainer}>
        <View style={styles.licenseTextContainer}>
          <MaterialIcons name="directions-car" size={24} color={Colors.light.primary} />
          <Text style={styles.licenseText}>Do you have a driving license?</Text>
        </View>
        <Switch
          value={hasLicense}
          onValueChange={setHasLicense}
          trackColor={{ false: Colors.light.disabled, true: Colors.light.secondary }}
          thumbColor={hasLicense ? Colors.light.primary : Colors.light.placeholder}
        />
      </View>

      <PrimaryButton
        label="Next"
        onPress={handleSubmit}
        disabled={!isFormValid}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
    padding: 50,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    margin: 30,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 20,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: Colors.light.primaryText,
  },
  licenseContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 30,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  licenseTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  licenseText: {
    marginLeft: 10,
    fontSize: 16,
    color: Colors.light.primaryText,
  },
});
