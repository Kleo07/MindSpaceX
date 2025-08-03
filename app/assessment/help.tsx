import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
} from 'react-native';
import { router } from 'expo-router';
import { useAssessment } from '../context/assessmentsContext';

const HelpScreen = () => {
  const [selected, setSelected] = useState<'yes' | 'no' | null>(null);
  const { setAssessment } = useAssessment();

  const handleContinue = () => {
    if (selected) {
      setAssessment((prev) => ({ ...prev, helpBefore: selected }));
      router.push('/assessment/distress');
    } else {
      alert('Please select Yes or No');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Assessment</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>6 of 14</Text>
        </View>
      </View>

      {/* Question */}
      <Text style={styles.title}>
        Have you sought{'\n'}professional help before?
      </Text>

      {/* Illustration */}
      <Image
        source={require('../../assets/images/help.png')}
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Options */}
      <View style={styles.optionRow}>
        <TouchableOpacity
          style={[
            styles.optionButton,
            selected === 'yes' && styles.optionSelected,
          ]}
          onPress={() => setSelected('yes')}
        >
          <Text
            style={[
              styles.optionText,
              selected === 'yes' && styles.optionTextSelected,
            ]}
          >
            Yes
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.optionButton,
            selected === 'no' && styles.optionSelected,
          ]}
          onPress={() => setSelected('no')}
        >
          <Text
            style={[
              styles.optionText,
              selected === 'no' && styles.optionTextSelected,
            ]}
          >
            No
          </Text>
        </TouchableOpacity>
      </View>

      {/* Continue */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
        <Text style={styles.continueText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
};

export default HelpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f5f4ff',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 30,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: '#3e3e3e',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3e3e3e',
  },
  progressBadge: {
    backgroundColor: '#f3e5db',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  progressText: {
    fontSize: 12,
    color: '#5b4234',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3e2d27',
    textAlign: 'center',
    marginVertical: 30,
  },
  illustration: {
    width: 250,
    height: 250,
    marginBottom: 10,
  },
  optionRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  optionButton: {
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingVertical: 14,
    paddingHorizontal: 30,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 1,
  },
  optionSelected: {
    backgroundColor: '#b8dba7',
    borderColor: '#98c190',
  },
  optionText: {
    fontSize: 16,
    color: '#4a3b35',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#2e452e',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#4a3b35',
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 30,
    width: '100%',
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});