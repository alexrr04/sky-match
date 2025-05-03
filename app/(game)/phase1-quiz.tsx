import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch, Dimensions } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import { Colors } from '@/constants/Colors';
import PrimaryButton from '@/components/PrimaryButton';
import { useNavigate } from '@/hooks/useNavigate';

const { width, height } = Dimensions.get('window');

export default function Phase1Quiz() {
  const [originAirport, setOriginAirport] = useState('');
  const [budget, setBudget] = useState('');
  const [hasLicense, setHasLicense] = useState(false);

  const { navigateTo } = useNavigate();

  const handleSubmit = () => {
    // TODO: Handle form submission
    navigateTo('/quiz');
  };

  const isFormValid = originAirport.trim() !== '' && budget.trim() !== '';

  return (
    <View style={styles.container}>
      <View style={styles.centerContainer}>
        <View style={styles.formContainer}>
          <Text style={styles.title}>Travel Preferences</Text>
          
          {/* Origin Airport Input */}
          <View style={styles.formGroup}>
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
          </View>

          {/* Budget Input */}
          <View style={styles.formGroup}>
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
          </View>

          {/* License Toggle */}
          <View style={styles.formGroup}>
            <View style={styles.licenseContainer}>
              <View style={styles.licenseContent}>
                <View style={styles.licenseTextContainer}>
                  <MaterialIcons name="directions-car" size={24} color={Colors.light.primary} />
                  <Text style={styles.licenseText}>Do you have a driving license?</Text>
                </View>
                <View style={styles.switchContainer}>
                  <Switch
                    value={hasLicense}
                    onValueChange={setHasLicense}
                    trackColor={{ false: Colors.light.disabled, true: Colors.light.secondary }}
                    thumbColor={hasLicense ? Colors.light.primary : Colors.light.placeholder}
                  />
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* Submit Button */}
      <View style={styles.buttonContainer}>
        <PrimaryButton
          label="Next"
          onPress={handleSubmit}
          disabled={!isFormValid}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.light.background,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  formContainer: {
    width: width * 0.85,
    maxWidth: 400,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: Colors.light.primaryText,
    marginBottom: height * 0.04,
    textAlign: 'center',
  },
  formGroup: {
    marginBottom: height * 0.02,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: width * 0.04,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  input: {
    flex: 1,
    marginLeft: width * 0.03,
    fontSize: 16,
    color: Colors.light.primaryText,
  },
  licenseContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  licenseContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: width * 0.04,
  },
  licenseTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  licenseText: {
    marginLeft: width * 0.03,
    fontSize: 16,
    color: Colors.light.primaryText,
    flexShrink: 1,
  },
  switchContainer: {
    marginLeft: width * 0.03,
  },
  buttonContainer: {
    width: '100%',
    paddingHorizontal: width * 0.08,
    paddingBottom: width * 0.08,
    backgroundColor: Colors.light.background,
  }
});
