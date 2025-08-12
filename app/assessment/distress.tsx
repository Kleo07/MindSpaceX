// app/assessment/distress.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useApi } from '../../utils/api';
import { useAssessment } from '../context/assessmentsContext';

type DistressChoice = 'yes' | 'no';

const options = [
  {
    id: 'yes' as DistressChoice,
    title: 'Yes, one or multiple',
    description: "I'm experiencing physical pain in different places over my body.",
    icon: '✓',
  },
  {
    id: 'no' as DistressChoice,
    title: 'No Physical Pain At All',
    description: "I'm not experiencing any physical pain in my body at all :)",
    icon: '✕',
  },
];

export default function DistressScreen() {
  const [selected, setSelected] = useState<DistressChoice | null>(null);
  const { setAssessment } = useAssessment();
  const { saveAssessmentStep } = useApi();

  const handleContinue = async () => {
    if (!selected) {
      alert('Please select an option');
      return;
    }

    // Save to Context (auto-persisted to AsyncStorage by your provider)
    setAssessment(prev => ({ ...prev, distress: selected }));

    // (Optional) Save to your server too
    try {
      await saveAssessmentStep('distress', selected);
    } catch (e) {
      console.log('saveAssessmentStep(distress) failed:', e);
    }

    router.push('/assessment/sleepquality');
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Assessment</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>7 of 14</Text>
        </View>
      </View>

      {/* Question */}
      <Text style={styles.title}>
        Are you experiencing any{'\n'}physical distress?
      </Text>

      {/* Options */}
      {options.map((item) => {
        const isSelected = selected === item.id;
        return (
          <Pressable
            key={item.id}
            onPress={() => setSelected(item.id)}
            style={[styles.optionCard, isSelected && styles.optionCardSelected]}
          >
            {/* Icon */}
            <View style={[styles.iconCircle, isSelected && styles.iconCircleSelected]}>
              <Text style={[styles.iconText, isSelected && styles.iconTextSelected]}>
                {item.icon}
              </Text>
            </View>

            {/* Texts */}
            <View style={styles.optionTextContainer}>
              <Text style={[styles.optionTitle, isSelected && styles.optionTitleSelected]}>
                {item.title}
              </Text>
              <Text style={styles.optionDesc}>{item.description}</Text>
            </View>

            {/* Radio */}
            <View style={styles.radioCircleOuter}>
              {isSelected && <View style={styles.radioCircleInner} />}
            </View>
          </Pressable>
        );
      })}

      {/* Continue Button */}
      <TouchableOpacity style={styles.continueButton} onPress={handleContinue}>
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
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 22,
    color: '#3e3e3e',
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
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3e2d27',
    textAlign: 'center',
    marginVertical: 30,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 18,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#eee',
  },
  optionCardSelected: {
    backgroundColor: '#b8dba7',
    borderColor: '#99c28c',
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f4f1ee',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  iconCircleSelected: {
    backgroundColor: '#cfe6b9',
  },
  iconText: {
    fontSize: 16,
    color: '#3e3e3e',
  },
  iconTextSelected: {
    color: '#2c492b',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a3b35',
  },
  optionTitleSelected: {
    fontWeight: '700',
  },
  optionDesc: {
    fontSize: 14,
    color: '#5f564f',
    marginTop: 4,
  },
  radioCircleOuter: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#4a3b35',
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioCircleInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#4a3b35',
  },
  continueButton: {
    backgroundColor: '#4a3b35',
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 'auto',
    marginBottom: 90,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});