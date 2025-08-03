import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useState } from 'react';
import { router } from 'expo-router';

export default function GenderScreen() {
  const [selectedGender, setSelectedGender] = useState<'male' | 'female' | null>(null);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Assessment</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>2 of 14</Text>
        </View>
      </View>

      {/* Question */}
      <Text style={styles.questionText}>What's your official gender?</Text>

      {/* Options */}
      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={[styles.card, selectedGender === 'male' && styles.selectedCard]}
          onPress={() => setSelectedGender('male')}
        >
          <Text style={styles.cardLabel}>I am Male</Text>
          <Text style={styles.cardIcon}>♂️</Text>
          <Text style={styles.emoji}>🧔‍♂️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.card, selectedGender === 'female' && styles.selectedCard]}
          onPress={() => setSelectedGender('female')}
        >
          <Text style={styles.cardLabel}>I am Female</Text>
          <Text style={styles.cardIcon}>♀️</Text>
          <Text style={styles.emoji}>👩‍🦰</Text>
        </TouchableOpacity>
      </View>

      {/* Skip Button */}
      <TouchableOpacity
        style={styles.skipBtn}
        onPress={() => router.push('/assessment/age')}
      >
        <Text style={styles.skipText}>Prefer to skip, thanks</Text>
        <Text style={styles.skipX}>✕</Text>
      </TouchableOpacity>

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.continueBtn}
        onPress={() => router.push('/assessment/age')}
      >
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
  backText: {
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
  questionText: {
    fontSize: 24,
    fontWeight: '700',
    color: '#3e2d27',
    textAlign: 'center',
    marginVertical: 30,
  },
  cardContainer: {
    gap: 20,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e0dcd7',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    alignItems: 'center',
  },
  selectedCard: {
    borderColor: '#3c3c3c',
  },
  cardLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3e3e3e',
    marginBottom: 5,
  },
  cardIcon: {
    fontSize: 16,
    color: '#777',
    marginBottom: 5,
  },
  emoji: {
    fontSize: 50,
  },
  skipBtn: {
    backgroundColor: '#d9e5c9',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 30,
    marginTop: 30,
  },
  skipText: {
    fontSize: 16,
    color: '#3c5234',
    fontWeight: '600',
  },
  skipX: {
    fontSize: 18,
    color: '#3c5234',
  },
  continueBtn: {
    backgroundColor: '#4a3b35',
    paddingVertical: 18,
    alignItems: 'center',
    borderRadius: 30,
    marginTop: 20,
  },
  continueText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});