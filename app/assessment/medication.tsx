import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
  Dimensions,
} from 'react-native';
import { router } from 'expo-router';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Haptics from 'expo-haptics';
import { useAssessment } from '../context/assessmentsContext';

const frequencies = [
  { label: 'Daily', emoji: '📅', color: '#A7D676' },
  { label: 'Few times a week', emoji: '🗓️', color: '#FCD653' },
  { label: 'Occasionally', emoji: '⏱️', color: '#F89C2B' },
  { label: 'Not sure', emoji: '❓', color: '#D96E28' },
];

const MedicationFrequencyScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();
  const { setAssessment } = useAssessment();

  const onSelect = (index: number) => {
    Haptics.selectionAsync();
    Animated.sequence([
      Animated.spring(scaleAnim, {
        toValue: 1.15,
        friction: 4,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 4,
        useNativeDriver: true,
      }),
    ]).start();
    setSelectedIndex(index);
  };

  const handleContinue = () => {
    if (selectedIndex !== null) {
      const label = frequencies[selectedIndex].label.toLowerCase();
      setAssessment((prev) => ({ ...prev, medicationFrequency: label }));
      router.push('/assessment/symptoms');
    }
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
        <Text style={styles.subtitle}>
          Selected: {frequencies[selectedIndex].label}
        </Text>
      )}

      {/* Big Emoji */}
      <Animated.Text
        style={[
          styles.bigEmoji,
          { transform: [{ scale: scaleAnim }] },
        ]}
      >
        {selectedIndex !== null ? frequencies[selectedIndex].emoji : '💊'}
      </Animated.Text>

      {/* Option Selector */}
      <View style={styles.dialContainer}>
        {frequencies.map((item, index) => {
          const isSelected = index === selectedIndex;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.moodSegment,
                {
                  backgroundColor: item.color,
                  transform: [{ scale: isSelected ? 1.2 : 1 }],
                  opacity: isSelected ? 1 : 0.8,
                },
              ]}
              onPress={() => onSelect(index)}
              activeOpacity={0.9}
            >
              <Text style={styles.segmentEmoji}>{item.emoji}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.button,
          { opacity: selectedIndex !== null ? 1 : 0.5 },
        ]}
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
const segmentWidth = width * 0.16;

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
    width: '90%',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 20,
  },
  moodSegment: {
    width: segmentWidth,
    height: segmentWidth * 1.6,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
  },
  segmentEmoji: {
    fontSize: 24,
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