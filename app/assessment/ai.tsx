import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';

export default function SoundAnalysisScreen() {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.circleIcon}>◐</Text>
        <Text style={styles.headerText}>Assessment</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>12 of 14</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>AI Sound Analysis</Text>

      {/* Subtitle */}
      <Text style={styles.subtitle}>
        Please say the following words below. Don’t{"\n"}worry, we don’t steal your voice data.
      </Text>

      {/* Concentric Circles */}
      <View style={styles.ringsContainer}>
        <View style={[styles.ring, { backgroundColor: '#DDEBCF', width: 200, height: 200 }]} />
        <View style={[styles.ring, { backgroundColor: '#C8E2AA', width: 140, height: 140 }]} />
        <View style={[styles.ring, { backgroundColor: '#96B870', width: 80, height: 80 }]} />
        <View style={[styles.ring, { backgroundColor: '#35431D', width: 30, height: 30 }]} />
      </View>

      {/* Highlighted Sentence */}
      <View style={styles.sentenceRow}>
        <View style={styles.highlightBox}>
          <Text style={styles.highlightText}>I believe in</Text>
        </View>
        <Text style={styles.restText}> Dr. Freud,with all my heart.</Text>
      </View>
      

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/assessment/expression')}
      >
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAF7',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleIcon: {
    fontSize: 24,
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
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#3e2d27',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 14,
    color: '#7B7B7B',
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 20,
  },
  ringsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  ring: {
    position: 'absolute',
    borderRadius: 999,
  },
  sentenceRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    flexWrap: 'wrap',
  },
  highlightBox: {
    backgroundColor: '#F78E1E',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  highlightText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  restText: {
    fontSize: 16,
    color: '#4F4F4F',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4a3b35',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
    marginBottom: 90,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});