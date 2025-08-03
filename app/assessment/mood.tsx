// app/assessment/mood.tsx
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
import { useAssessment } from '../context/assessmentsContext';

const moods = [
  { emoji: '😢', label: 'Very Sad', color: '#D96E28' },
  { emoji: '🙁', label: 'Sad', color: '#F89C2B' },
  { emoji: '😐', label: 'Neutral', color: '#FCD653' },
  { emoji: '🙂', label: 'Happy', color: '#B6D67B' },
  { emoji: '😄', label: 'Very Happy', color: '#A7A2F5' },
];

const MoodScreen = () => {
  const [selectedIndex, setSelectedIndex] = useState(2);
  const scaleAnim = useRef(new Animated.Value(1)).current;
  const insets = useSafeAreaInsets();
  const { setAssessment } = useAssessment(); // ✅ Përdor context siç duhet

  const onSelect = (index: number) => {
    Animated.sequence([
      Animated.timing(scaleAnim, {
        toValue: 1.15,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 150,
        useNativeDriver: true,
      }),
    ]).start();
    setSelectedIndex(index);
  };

  const handleContinue = () => {
    setAssessment(prev => ({
      ...prev,
      mood: moods[selectedIndex].label,
      moodEmoji: moods[selectedIndex].emoji,
      moodIndex: selectedIndex,
    }));
    router.push('/assessment/help');
  };

  return (
    <SafeAreaView style={[styles.container, { paddingTop: insets.top + 20, paddingBottom: insets.bottom + 20 }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Assessment</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>5 of 14</Text>
        </View>
      </View>

      {/* Question */}
      <Text style={styles.title}>How would you describe your mood?</Text>
      <Text style={styles.subtitle}>I Feel {moods[selectedIndex].label}.</Text>

      {/* Big Emoji */}
      <Animated.Text style={[styles.bigEmoji, { transform: [{ scale: scaleAnim }] }]}>
        {moods[selectedIndex].emoji}
      </Animated.Text>

      {/* Mood Selector */}
      <View style={styles.dialContainer}>
        {moods.map((mood, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.moodSegment,
              {
                backgroundColor: mood.color,
                transform: [{ scale: selectedIndex === index ? 1.2 : 1 }],
              },
            ]}
            onPress={() => onSelect(index)}
            activeOpacity={0.8}
          >
            <Text style={styles.segmentEmoji}>{mood.emoji}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default MoodScreen;

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
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});