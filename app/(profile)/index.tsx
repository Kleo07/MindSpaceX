import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Image,
} from 'react-native';
import { useUser, useAuth } from '@clerk/clerk-expo';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useFocusEffect } from 'expo-router';
import BottomNavBar from '../components/BottomNavBar';

const avatars = ['😀', '😎', '😇', '🤓', '🥳', '😜'];

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const [weight, setWeight] = useState(65);
  const [gender, setGender] = useState('Male');
  const [wellnessScore, setWellnessScore] = useState<number | null>(null);
  const [assessmentDone, setAssessmentDone] = useState(false);
  const [assessmentData, setAssessmentData] = useState<Record<string, string>>({});

  const emailName =
    user?.emailAddresses?.[0]?.emailAddress?.split('@')[0]?.replace(/^\w/, (c) => c.toUpperCase()) || 'Friend';

  const handleLogout = async () => {
    try {
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const calculateScore = (data: Record<string, string>) => {
    let score = 0;

    switch (data.goal) {
      case '❤️ I wanna reduce stress': score += 25; break;
      case '🧠 I wanna try AI Therapy': score += 20; break;
      case '🕊️ I want to cope with trauma': score += 15; break;
      case '😊 I want to be a better person': score += 10; break;
      case '👻 Just trying out the app, mate!': score += 5; break;
    }

    switch (data.mood) {
      case 'Very Happy': score += 25; break;
      case 'Happy': score += 20; break;
      case 'Neutral': score += 15; break;
      case 'Sad': score += 10; break;
      case 'Very Sad': score += 5; break;
    }

    switch (data.sleepQuality?.toLowerCase()) {
      case 'excellent': score += 25; break;
      case 'good': score += 20; break;
      case 'fair': score += 15; break;
      case 'poor': score += 10; break;
      case 'worst': score += 5; break;
    }

    switch (data.medication) {
      case 'Regularly': score += 25; break;
      case 'Sometimes': score += 15; break;
      case 'Rarely': score += 10; break;
      case 'Never': score += 5; break;
    }

    return Math.min(score, 100);
  };

  const loadData = async () => {
    const avatarIndex = await AsyncStorage.getItem('selectedAvatar');
    const photoUri = await AsyncStorage.getItem('customPhoto');
    if (avatarIndex !== null) setSelectedAvatar(parseInt(avatarIndex, 10));
    if (photoUri) setCustomImage(photoUri);

    const keys = ['goal', 'mood', 'sleepQuality', 'medication', 'gender', 'weight'];
    const data: Record<string, string> = {};
    let filledCount = 0;

    for (const key of keys) {
      const value = await AsyncStorage.getItem(`assessment_${key}`);
      if (value) {
        data[key] = value;
        filledCount++;
        if (key === 'gender') setGender(value.charAt(0).toUpperCase() + value.slice(1).toLowerCase());
        if (key === 'weight') setWeight(Number(value));
      }
    }

    setAssessmentData(data);
    setAssessmentDone(filledCount >= 3);
    setWellnessScore(calculateScore(data));
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [])
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.greeting}>Hi {emailName} 👋</Text>
        <Text style={styles.subGreeting}>Take a deep breath, you're doing great.</Text>

        <View style={styles.avatarContainer}>
          {customImage ? (
            <Image source={{ uri: customImage }} style={styles.avatarImage} />
          ) : selectedAvatar !== null ? (
            <Text style={styles.avatarEmoji}>{avatars[selectedAvatar]}</Text>
          ) : (
            <Text style={styles.avatarEmoji}>😊</Text>
          )}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>Your Info</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Gender:</Text>
            <Text style={styles.infoValue}>{gender}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Weight:</Text>
            <Text style={styles.infoValue}>{weight} kg</Text>
          </View>

          {wellnessScore !== null ? (
            <View
              style={[
                styles.scoreBadge,
                wellnessScore >= 76
                  ? styles.scoreHigh
                  : wellnessScore >= 26
                  ? styles.scoreMedium
                  : styles.scoreLow,
              ]}
            >
              <Text style={styles.scoreText}>
                🌟 Wellness Score: {wellnessScore}/100{' '}
                {wellnessScore >= 76 ? '💚' : wellnessScore >= 26 ? '⚠️' : '🔴'}
              </Text>
            </View>
          ) : (
            <Text style={{ color: '#888', marginTop: 6 }}>
              Complete your assessment to view your wellness score.
            </Text>
          )}

          {assessmentDone &&
            Object.entries(assessmentData).map(([key, value]) => {
              if (['gender', 'weight'].includes(key)) return null;

              const formattedValue =
                typeof value === 'string'
                  ? value.charAt(0).toUpperCase() + value.slice(1).toLowerCase()
                  : value;

              return (
                <View style={styles.infoRow} key={key}>
                  <Text style={styles.infoLabel}>
                    {key.charAt(0).toUpperCase() + key.slice(1)}:
                  </Text>
                  <Text style={styles.infoValue}>{formattedValue}</Text>
                </View>
              );
            })}
        </View>

        <Text style={styles.quickAccessTitle}>Quick Access</Text>
        <View style={styles.quickAccessContainer}>
          <TouchableOpacity style={styles.quickCard} onPress={() => alert('Start meditation')}>
            <Text style={styles.cardEmoji}>🧘‍♀️</Text>
            <Text style={styles.cardText}>Start Meditation</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/ProfileSetupScreen')}>
            <Text style={styles.cardEmoji}>📝</Text>
            <Text style={styles.cardText}>Edit Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickCard} onPress={() => router.push('/assessment')}>
            <Text style={styles.cardEmoji}>📋</Text>
            <Text style={styles.cardText}>Assessment</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.quickCard} onPress={() => alert('Open Journal')}>
            <Text style={styles.cardEmoji}>💬</Text>
            <Text style={styles.cardText}>Journal</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>Log Out</Text>
        </TouchableOpacity>
      </ScrollView>

      
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f9f8f5' },
  container: { padding: 20, paddingBottom: 60 },
  greeting: { fontSize: 26, fontWeight: '700', color: '#4a3b35', marginBottom: 4 },
  subGreeting: { fontSize: 16, color: '#4a3b35', marginBottom: 20 },
  avatarContainer: {
    alignSelf: 'center',
    backgroundColor: '#e6edd8',
    width: 100,
    height: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarImage: { width: 80, height: 80, borderRadius: 40 },
  avatarEmoji: { fontSize: 42 },
  infoCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    elevation: 2,
    marginBottom: 28,
  },
  infoTitle: { fontSize: 18, fontWeight: '600', color: '#4a3b35', marginBottom: 12 },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
  },
  infoLabel: { fontSize: 15, color: '#4a3b35', fontWeight: '500' },
  infoValue: { fontSize: 15, color: '#4a3b35' },
  scoreBadge: {
    marginTop: 12,
    padding: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  scoreText: { fontSize: 16, fontWeight: '600', color: '#fff' },
  scoreHigh: { backgroundColor: '#28a745' },
  scoreMedium: { backgroundColor: '#ffc107' },
  scoreLow: { backgroundColor: '#dc3545' },
  quickAccessTitle: { fontSize: 18, fontWeight: '600', marginBottom: 10, color: '#4a3b35' },
  quickAccessContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 14,
    justifyContent: 'space-between',
  },
  quickCard: {
    width: '47%',
    backgroundColor: '#e7f0d9',
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: 'center',
    marginBottom: 14,
  },
  cardEmoji: { fontSize: 28, marginBottom: 6 },
  cardText: { fontSize: 15, fontWeight: '500', color: '#4a3b35' },
  logoutBtn: {
    marginTop: 20,
    backgroundColor: '#d9534f',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
  },
  logoutText: { color: 'white', fontSize: 16, fontWeight: '600' },
});