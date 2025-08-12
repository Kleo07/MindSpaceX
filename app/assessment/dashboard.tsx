// app/assessment/dashboard.tsx
import { AntDesign } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React from 'react';
import {
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAssessment } from '../context/assessmentsContext';

export default function DashboardScreen() {
  const { assessment } = useAssessment();
  const router = useRouter();

  // Hide any technical/internal keys you don’t want in the summary
  const HIDDEN_KEYS = new Set([
    'moodEmoji',
    'moodIndex',
    'ai',            // keep this hidden; it’s just consent flag
    'summary',       // if you write a long summary elsewhere
  ]);

  const entries = Object.entries(assessment || {}).filter(
    ([key, value]) => value !== undefined && !HIDDEN_KEYS.has(key)
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar barStyle="dark-content" backgroundColor="#FEFAF7" />

      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={26} color="#4a3b35" />
      </TouchableOpacity>

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.circleIcon} />
          <Text style={styles.headerText}>Your Assessment</Text>
          <View style={styles.progressBadge}>
            <Text style={styles.progressText}>Summary</Text>
          </View>
        </View>

        {/* Title */}
        <Text style={styles.title}>Here’s what you shared:</Text>

        {/* Assessment Summary */}
        <ScrollView style={styles.summaryBox} showsVerticalScrollIndicator={false}>
          {entries.length === 0 ? (
            <Text style={styles.emptyText}>No responses found.</Text>
          ) : (
            entries.map(([key, value]) => (
              <View key={key} style={styles.item}>
                <Text style={styles.itemKey}>{formatKey(key)}</Text>
                <Text style={styles.itemValue}>{formatValue(value)}</Text>
              </View>
            ))
          )}
        </ScrollView>

        {/* Go to Profile */}
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/(profile)')}
        >
          <Text style={styles.buttonText}>Go to Profile →</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const formatKey = (key: string) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();

const formatValue = (val: unknown) => {
  if (typeof val === 'boolean') return val ? 'Yes' : 'No';
  if (typeof val === 'number') return String(val);
  if (val == null) return '';
  return String(val);
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#FEFAF7',
  },
  container: {
    flex: 1,
    backgroundColor: '#FEFAF7',
    paddingHorizontal: 24,
    paddingTop: 10,    // safe area already handled
    paddingBottom: 30,
  },
  backButton: {
    position: 'absolute',
    top: 8, // sits inside the safe area nicely
    left: 16,
    zIndex: 10,
    height: 40,
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    marginTop: 28, // pushes content below the back button
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
    marginTop: 20,
    marginBottom: 20,
  },
  summaryBox: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  item: {
    borderBottomWidth: 1,
    borderBottomColor: '#EEE',
    paddingVertical: 10,
  },
  itemKey: {
    fontWeight: '600',
    fontSize: 14,
    color: '#555',
  },
  itemValue: {
    fontSize: 16,
    color: '#2e2e2e',
    marginTop: 4,
  },
  emptyText: {
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    marginTop: 50,
  },
  button: {
    backgroundColor: '#4a3b35',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 90,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});