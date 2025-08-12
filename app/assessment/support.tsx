// app/assessment/support.tsx
import { router } from 'expo-router';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useApi } from '../../utils/api';
import { useAssessment } from '../context/assessmentsContext';

const descriptions = [
  'Not at all supported.',
  'Slightly supported.',
  'Moderately supported.',
  'Well supported.',
  'Extremely supported.',
];

export default function SupportScreen() {
  const [selected, setSelected] = useState(3); // default mid-value
  const { setAssessment } = useAssessment();
  const { saveAssessmentStep } = useApi();

  const handleContinue = async () => {
    const level = selected + 1;
    const desc = descriptions[selected];

    // 1) update context (persisted nga provider-i yt)
    setAssessment(prev => ({
      ...prev,
      supportLevel: level,
      supportDescription: desc,
    }));

    // 2) fire-and-forget te serveri
    try {
      await saveAssessmentStep('support', { level, description: desc });
    } catch {
      /* s'e bllokojmë navigimin */
    }

    // 3) vazhdo
    router.push('/assessment/ai');
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
          <Text style={styles.progressText}>11 of 14</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>How supported do you feel?</Text>

      {/* Selected Value */}
      <Text style={styles.selectedNumber}>{selected + 1}</Text>

      {/* Selector */}
      <View style={styles.selectorContainer}>
        {[...Array(5)].map((_, index) => (
          <TouchableOpacity
            key={index}
            style={[styles.circle, selected === index && styles.activeCircle]}
            onPress={() => setSelected(index)}
          >
            <Text
              style={[styles.circleText, selected === index && styles.activeText]}
            >
              {index + 1}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Description */}
      <Text style={styles.description}>{descriptions[selected]}</Text>

      {/* Continue Button */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FEFAF7', paddingHorizontal: 24, paddingTop: 60, paddingBottom: 30, justifyContent: 'space-between' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backIcon: { fontSize: 24, color: '#3e3e3e' },
  headerText: { fontSize: 18, fontWeight: '600', color: '#3e3e3e' },
  progressBadge: { backgroundColor: '#f3e5db', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 15 },
  progressText: { fontSize: 12, color: '#5b4234' },
  title: { fontSize: 22, fontWeight: '700', textAlign: 'center', color: '#3e2d27', marginTop: 40 },
  selectedNumber: { fontSize: 64, fontWeight: '700', textAlign: 'center', color: '#3e2d27', marginVertical: 20 },
  selectorContainer: { flexDirection: 'row', justifyContent: 'space-around', backgroundColor: '#fff', padding: 12, borderRadius: 50, marginHorizontal: 10, marginBottom: 20, elevation: 2 },
  circle: { width: 44, height: 44, borderRadius: 22, backgroundColor: '#f0e7e2', justifyContent: 'center', alignItems: 'center' },
  activeCircle: { backgroundColor: '#F6A945', borderColor: '#fff', borderWidth: 2 },
  circleText: { fontSize: 16, color: '#3e2d27' },
  activeText: { color: '#fff', fontWeight: '600' },
  description: { textAlign: 'center', color: '#7B7B7B', fontSize: 14, marginTop: 8 },
  button: { backgroundColor: '#4a3b35', paddingVertical: 18, borderRadius: 30, alignItems: 'center', marginTop: 30, marginBottom: 90 },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});