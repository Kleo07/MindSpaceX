import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { router } from 'expo-router';
import { useAssessment } from '../context/assessmentsContext';
import type { AssessmentData } from '../context/assessmentsContext';

const options = [
  { id: 1, label: '❤️ I wanna reduce stress' },
  { id: 2, label: '🧠 I wanna try AI Therapy' },
  { id: 3, label: '🕊️ I want to cope with trauma' },
  { id: 4, label: '😊 I want to be a better person' },
  { id: 5, label: '👻 Just trying out the app, mate!' },
];

export default function AssessmentHome() {
  const [selectedOption, setSelectedOption] = useState<number | null>(2); // default
  const { setAssessment } = useAssessment();

  const handleContinue = () => {
    if (selectedOption !== null) {
      const selectedLabel = options.find(o => o.id === selectedOption)?.label || '';
      setAssessment((prev: AssessmentData) => ({ ...prev, goal: selectedLabel }));
      router.push('/assessment/gender');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Assessment</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>1 of 14</Text>
        </View>
      </View>

      {/* Question */}
      <Text style={styles.questionText}>What's your health goal for today?</Text>

      {/* Options */}
      <ScrollView style={{ width: '100%' }} contentContainerStyle={styles.optionsContainer}>
        {options.map(option => (
          <TouchableOpacity
            key={option.id}
            style={[
              styles.optionButton,
              selectedOption === option.id && styles.selectedOption,
            ]}
            onPress={() => setSelectedOption(option.id)}
          >
            <Text
              style={[
                styles.optionText,
                selectedOption === option.id && styles.selectedOptionText,
              ]}
            >
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Continue Button */}
      <TouchableOpacity onPress={handleContinue} style={styles.continueButton}>
        <Text style={styles.continueText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefaf7',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backText: {
    fontSize: 22,
    marginRight: 8,
  },
  headerText: {
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
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3e2d27',
    textAlign: 'center',
    marginVertical: 30,
  },
  optionsContainer: {
    gap: 12,
    alignItems: 'center',
  },
  optionButton: {
    width: '100%',
    backgroundColor: '#fff',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 18,
    borderColor: '#ccc',
    borderWidth: 1,
    elevation: 2,
  },
  optionText: {
    fontSize: 16,
    color: '#4a3b35',
    fontWeight: '500',
  },
  selectedOption: {
    backgroundColor: '#b8dba7',
    borderColor: '#9cc28d',
  },
  selectedOptionText: {
    color: '#2e452e',
    fontWeight: '600',
  },
  continueButton: {
    backgroundColor: '#4a3b35',
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 30,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});