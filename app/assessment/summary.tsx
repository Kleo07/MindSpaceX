// app/assessment/summary.tsx
import { useRouter } from 'expo-router';
import React, { useEffect, useRef } from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAssessment } from '../context/assessmentsContext';

export default function SummaryScreen() {
  const router = useRouter();
  const { assessment } = useAssessment();

  // ✅ Ky tip funksionon si në RN (DOM) ashtu edhe në Node env
  const autosaveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    // Shembull: autosave/log cdo 2s (zëvendësoje me çfarë të duash)
    autosaveIntervalRef.current = setInterval(() => {
      // p.sh. mund të bësh send në server ose console.log
      // console.log('autosave summary', assessment);
    }, 2000);

    return () => {
      if (autosaveIntervalRef.current) {
        clearInterval(autosaveIntervalRef.current);
        autosaveIntervalRef.current = null;
      }
    };
  }, [assessment]);

  const formattedEntries = Object.entries(assessment || {});

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Assessment</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>Summary</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Here’s what you shared:</Text>

      {/* Summary list */}
      <ScrollView style={styles.summaryBox}>
        {formattedEntries.length === 0 ? (
          <Text style={styles.emptyText}>No responses found.</Text>
        ) : (
          formattedEntries.map(([key, value]) => (
            <View key={key} style={styles.item}>
              <Text style={styles.itemKey}>{formatKey(key)}</Text>
              <Text style={styles.itemValue}>{String(value)}</Text>
            </View>
          ))
        )}
      </ScrollView>

      {/* Continue */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/assessment/dashboard')}
      >
        <Text style={styles.buttonText}>Finish</Text>
      </TouchableOpacity>
    </View>
  );
}

const formatKey = (key: string) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAF7',
    paddingHorizontal: 24,
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