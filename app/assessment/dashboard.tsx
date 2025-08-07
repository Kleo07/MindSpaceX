import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import { useAssessment } from '../context/assessmentsContext';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

export default function DashboardScreen() {
  const { assessment } = useAssessment();
  const router = useRouter();

  const formattedEntries = Object.entries(assessment || {});

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FEFAF7" />

      {/* Back button */}
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <AntDesign name="arrowleft" size={26} color="#4a3b35" />
      </TouchableOpacity>

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.circleIcon}></Text>
        <Text style={styles.headerText}>Your Assessment</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>Summary</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Here’s what you shared:</Text>

      {/* Assessment Summary */}
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

      {/* Button that now goes to Profile */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/(profile)')}
      >
        <Text style={styles.buttonText}>Go to Profile →</Text>
      </TouchableOpacity>
    </View>
  );
}

const formatKey = (key: string) =>
  key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase())
    .trim();

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAF7',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  backButton: {
    position: 'absolute',
    top: 52,
    left: 20,
    zIndex: 10,
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