// app/assessment/sleepquality.tsx
import * as Haptics from 'expo-haptics';
import { router } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import {
  Animated,
  PanResponder,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAssessment } from '../context/assessmentsContext';

const sleepLevels = [
  { label: 'Excellent', hours: '7–9 HOURS', emoji: '😊', color: '#84C784' },
  { label: 'Good',      hours: '6–7 HOURS', emoji: '🙂', color: '#FFD76A' },
  { label: 'Fair',      hours: '5 HOURS',   emoji: '😐', color: '#C1A192' },
  { label: 'Poor',      hours: '3–4 HOURS', emoji: '😟', color: '#FF914D' },
  { label: 'Worst',     hours: '<3 HOURS',  emoji: '😵', color: '#A48BE0' },
];

const TRACK_HEIGHT = 300;
const ITEM_HEIGHT = TRACK_HEIGHT / (sleepLevels.length - 1);

export default function SleepQualityScreen() {
  const { setAssessment } = useAssessment();
  const [selectedIndex, setSelectedIndex] = useState(3);
  const position = useRef(new Animated.Value(ITEM_HEIGHT * 3)).current;

  // Update selectedIndex while dragging
  useEffect(() => {
    const id = position.addListener(({ value }) => {
      const liveIndex = Math.round(value / ITEM_HEIGHT);
      const clamped = Math.max(0, Math.min(sleepLevels.length - 1, liveIndex));
      if (clamped !== selectedIndex) setSelectedIndex(clamped);
    });
    return () => position.removeListener(id);
  }, [position, selectedIndex]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gesture) => {
        const newY = Math.max(0, Math.min(TRACK_HEIGHT, gesture.dy + selectedIndex * ITEM_HEIGHT));
        position.setValue(newY);
      },
      onPanResponderRelease: () => {
        // snap to nearest option
        // @ts-ignore private _value is fine here for snap
        const finalIndex = Math.round(position._value / ITEM_HEIGHT);
        const clampedIndex = Math.max(0, Math.min(sleepLevels.length - 1, finalIndex));
        Animated.spring(position, {
          toValue: clampedIndex * ITEM_HEIGHT,
          useNativeDriver: false,
        }).start();
        Haptics.selectionAsync();
      },
    })
  ).current;

  const handleContinue = () => {
    const quality = sleepLevels[selectedIndex].label; // Keep Title Case
    setAssessment(prev => ({ ...prev, sleepQuality: quality }));
    router.push('/assessment/medication');
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
          <Text style={styles.progressText}>8 of 14</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>How would you rate your{'\n'}sleep quality?</Text>

      {/* Slider */}
      <View style={styles.sliderRow}>
        {/* Labels */}
        <View style={styles.labelsColumn}>
          {sleepLevels.map((item, index) => (
            <View key={item.label} style={[styles.labelRow, { height: ITEM_HEIGHT }]}>
              <Text style={[styles.labelText, selectedIndex === index && styles.labelTextActive]}>
                {item.label}
              </Text>
              <Text style={[styles.hourText, selectedIndex === index && styles.hourTextActive]}>
                🕒 {item.hours}
              </Text>
            </View>
          ))}
        </View>

        {/* Track + Thumb */}
        <View style={styles.sliderTrackContainer}>
          <View style={styles.sliderTrack} />
          <Animated.View
            {...panResponder.panHandlers}
            style={[
              styles.sliderThumb,
              {
                // @ts-ignore Animated.subtract number ok here
                top: Animated.subtract(position, 20),
                backgroundColor: sleepLevels[selectedIndex].color,
              },
            ]}
          />
        </View>

        {/* Emojis */}
        <View style={styles.emojisColumn}>
          {sleepLevels.map((item, index) => (
            <View key={item.emoji + index} style={[styles.emojiRow, { height: ITEM_HEIGHT }]}>
              <Text style={[styles.emojiText, selectedIndex === index && styles.emojiActive]}>
                {item.emoji}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Continue */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDF9F8',
    paddingTop: 60,
    paddingHorizontal: 30,
    paddingBottom: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backIcon: { fontSize: 22, color: '#3e3e3e' },
  headerTitle: { fontSize: 18, fontWeight: '600', color: '#3e3e3e' },
  progressBadge: {
    backgroundColor: '#f3e5db',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  progressText: { fontSize: 12, color: '#5b4234' },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 40,
    color: '#422B20',
  },
  sliderRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  labelsColumn: { flex: 1.3 },
  labelRow: { justifyContent: 'center' },
  labelText: { fontSize: 16, fontWeight: '600', color: '#B6B6B6' },
  labelTextActive: { color: '#422B20' },
  hourText: { fontSize: 12, color: '#C1C1C1' },
  hourTextActive: { color: '#422B20' },
  sliderTrackContainer: {
    width: 20,
    height: TRACK_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 20,
    position: 'relative',
  },
  sliderTrack: { width: 6, height: '100%', backgroundColor: '#E5DCD9', borderRadius: 3 },
  sliderThumb: {
    position: 'absolute',
    left: -12,
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
  },
  emojisColumn: { flex: 1 },
  emojiRow: { justifyContent: 'center', alignItems: 'center' },
  emojiText: { fontSize: 24, opacity: 0.4 },
  emojiActive: { opacity: 1 },
  button: {
    backgroundColor: '#4a3b35',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 90, // ← për të mos u mbuluar nga nav bar-i
  },
  buttonText: { color: '#fff', fontWeight: '600', fontSize: 16 },
});