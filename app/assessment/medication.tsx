// app/assessment/medication.tsx
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAssessment } from '../context/assessmentsContext';

const uiFrequencies = [
  { label: 'Daily', emoji: '📅', color: '#A7D676' },
  { label: 'Few times a week', emoji: '🗓️', color: '#FCD653' },
  { label: 'Occasionally', emoji: '⏱️', color: '#F89C2B' },
  { label: 'Not sure', emoji: '❓', color: '#D96E28' },
];

// Map UI -> values që i kupton kalkulimi i score-it në profil
const mapToScoreValue = (label: string): 'Regularly' | 'Sometimes' | 'Rarely' | 'Never' => {
  switch (label) {
    case 'Daily':
      return 'Regularly';
    case 'Few times a week':
      return 'Sometimes';
    case 'Occasionally':
      return 'Rarely';
    default:
      return 'Never'; // "Not sure" -> "Never" që të mos ngecë në 0
  }
};

const MedicationFrequencyScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();
  const { setAssessment } = useAssessment();

  const onSelect = (index: number) => {
    Haptics.selectionAsync();
    Animated.sequence([
      Animated.spring(scaleAnim, { toValue: 1.15, friction: 4, useNativeDriver: true }),
      Animated.spring(scaleAnim, { toValue: 1, friction: 4, useNativeDriver: true }),
    ]).start();
    setSelectedIndex(index);
  };

  const handleContinue = () => {
    if (selectedIndex === null) return;
    const uiLabel = uiFrequencies[selectedIndex].label;
    const valueForScore = mapToScoreValue(uiLabel);

    // 🔐 Ruaje te "medication" (kyçi që përdor profili për score)
    setAssessment(prev => ({ ...prev, medication: valueForScore }));

    router.push('/assessment/symptoms');
  };

  return (
    <SafeAreaView
      style={[
        styles.container,
        { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Assessment</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>9 of 14</Text>
        </View>
      </View>

      {/* Question */}
      <Text style={styles.title}>How often do you take them?</Text>
      {selectedIndex !== null && (
        <Text style={styles.subtitle}>Selected: {uiFrequencies[selectedIndex].label}</Text>
      )}

      {/* Big Emoji */}
      <Animated.Text style={[styles.bigEmoji, { transform: [{ scale: scaleAnim }] }]}>
        {selectedIndex !== null ? uiFrequencies[selectedIndex].emoji : '💊'}
      </Animated.Text>

      {/* Options */}
      <View style={styles.dialContainer}>
        {uiFrequencies.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.moodSegment,
                {
                  backgroundColor: item.color,
                  transform: [{ scale: isSelected ? 1.2 : 1 }],
                  opacity: isSelected ? 1 : 0.85,
                },
              ]}
              onPress={() => onSelect(index)}
              activeOpacity={0.9}
            >
              <Text style={styles.segmentEmoji}>{item.emoji}</Text>
              <Text style={styles.segmentLabel}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Continue */}
      <TouchableOpacity
        style={[styles.button, { opacity: selectedIndex !== null ? 1 : 0.5 }]}
        onPress={handleContinue}
        disabled={selectedIndex === null}
      >
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MedicationFrequencyScreen;

const { width } = Dimensions.get('window');
const segmentWidth = width * 0.2;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefaf7',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
    alignItems: 'center',
    marginBottom: 10,
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
    textAlign: 'center',
    color: '#3e2d27',
    marginTop: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#888',
    marginVertical: 12,
  },
  bigEmoji: {
    fontSize: 64,
    marginBottom: 10,
  },
  dialContainer: {
    flexDirection: 'row',
    width: '92%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
    flexWrap: 'wrap',
    gap: 12,
  },
  moodSegment: {
    width: segmentWidth,
    height: segmentWidth * 1.3,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    paddingHorizontal: 6,
  },
  segmentEmoji: {
    fontSize: 22,
    marginBottom: 6,
  },
  segmentLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3e2d27',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4a3b35',
    paddingVertical: 18,
    paddingHorizontal: 40,
    borderRadius: 30,
    marginTop: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});