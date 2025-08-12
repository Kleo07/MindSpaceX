// app/(profile)/index.tsx
import React from 'react';
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
import axios from 'axios';
import { BASE_URL, readAllFromStorage, clearLocalAssessment, clearLastUserMarker, AssessmentDoc } from '../../utils/api';

const avatars = ['😀', '😎', '😇', '🤓', '🥳', '😜'];

export default function ProfileScreen() {
  const { user } = useUser();
  const { signOut } = useAuth();
  const router = useRouter();

  const [selectedAvatar, setSelectedAvatar] = React.useState<number | null>(null);
  const [customImage, setCustomImage] = React.useState<string | null>(null);

  const [weight, setWeight] = React.useState<number | null>(null);
  const [weightUnit, setWeightUnit] = React.useState<string>('kg');
  const [gender, setGender] = React.useState<string | null>(null);

  const [wellnessScore, setWellnessScore] = React.useState<number | null>(null);
  const [assessmentData, setAssessmentData] = React.useState<AssessmentDoc | null>(null);

  const emailName =
    user?.emailAddresses?.[0]?.emailAddress
      ?.split('@')[0]
      ?.replace(/^\w/, (c) => c.toUpperCase()) || 'Friend';

  // -------- Helpers --------
  const calculateScore = (data: AssessmentDoc) => {
    let score = 0;

    switch (data.goal as string) {
      case '❤️ I wanna reduce stress': score += 25; break;
      case '🧠 I wanna try AI Therapy': score += 20; break;
      case '🕊️ I want to cope with trauma': score += 15; break;
      case '😊 I want to be a better person': score += 10; break;
      case '👻 Just trying out the app, mate!': score += 5; break;
    }

    switch (data.mood as string) {
      case 'Very Happy': score += 25; break;
      case 'Happy': score += 20; break;
      case 'Neutral': score += 15; break;
      case 'Sad': score += 10; break;
      case 'Very Sad': score += 5; break;
    }

    switch ((data.sleepQuality as string)?.toLowerCase()) {
      case 'excellent': score += 25; break;
      case 'good': score += 20; break;
      case 'fair': score += 15; break;
      case 'poor': score += 10; break;
      case 'worst': score += 5; break;
    }

    switch (data.medicationFrequency as string) {
      case 'daily': score += 25; break;
      case 'few times a week': score += 15; break;
      case 'occasionally': score += 10; break;
      case 'not sure': score += 5; break;
    }

    return Math.min(score, 100);
  };

  const loadFromLocal = async () => {
    const avatarIndex = await AsyncStorage.getItem('selectedAvatar');
    const photoUri = await AsyncStorage.getItem('customPhoto');
    if (avatarIndex !== null) setSelectedAvatar(parseInt(avatarIndex, 10));
    if (photoUri) setCustomImage(photoUri);

    const local = await readAllFromStorage();
    if (Object.keys(local).length > 0) {
      setAssessmentData(local);

      if (typeof local.gender === 'string' && local.gender !== 'Prefer not to say') {
        setGender(local.gender.charAt(0).toUpperCase() + local.gender.slice(1).toLowerCase());
      } else {
        setGender(null);
      }

      if (typeof local.weight === 'number') setWeight(local.weight);
      if (typeof local.weightUnit === 'string') setWeightUnit(local.weightUnit);
      setWellnessScore(calculateScore(local));
      return true;
    }
    return false;
  };

  const loadFromServer = async () => {
    if (!user?.id) return false;
    try {
      const res = await axios.get<{ ok: boolean; data: AssessmentDoc | null }>(
        `${BASE_URL}/api/assessment/${user.id}`
      );
      if (res.data && res.data.ok && res.data.data) {
        const d = res.data.data;

        setAssessmentData(d);

        if (typeof d.gender === 'string' && d.gender !== 'Prefer not to say') {
          setGender(d.gender.charAt(0).toUpperCase() + d.gender.slice(1).toLowerCase());
        } else {
          setGender(null);
        }

        setWeight(typeof d.weight === 'number' ? d.weight : null);
        setWeightUnit(typeof d.weightUnit === 'string' ? d.weightUnit : 'kg');
        setWellnessScore(calculateScore(d));

        // keep local cache in sync
        const pairs: [string, string][] = Object.entries(d).map(([k, v]) => [
          `assessment_${k}`,
          Array.isArray(v) ? JSON.stringify(v) : String(v),
        ]);
        if (pairs.length) await AsyncStorage.multiSet(pairs);

        return true;
      }
    } catch (e) {
      // ignore, we'll fallback to local
    }
    return false;
  };

  const loadData = async () => {
    const okServer = await loadFromServer();
    if (!okServer) {
      await loadFromLocal();
    }
  };

  const handleLogout = async () => {
    try {
      await clearLocalAssessment();
      await clearLastUserMarker();
      await signOut();
      router.replace('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      loadData();
    }, [user?.id])
  );

  const isEmpty = !assessmentData || Object.keys(assessmentData).length === 0;

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

          {isEmpty ? (
            <Text style={{ color: '#888', marginTop: 6 }}>
              Complete your assessment to view your wellness score and profile info.
            </Text>
          ) : (
            <>
              {gender && (
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>Gender:</Text>
                  <Text style={styles.infoValue}>{gender}</Text>
                </View>
              )}
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Weight:</Text>
                <Text style={styles.infoValue}>
                  {weight != null ? `${weight} ${weightUnit}` : '--'}
                </Text>
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

              {assessmentData &&
                Object.entries(assessmentData).map(([key, value]) => {
                  if (
                    ['gender', 'weight', 'weightUnit', 'userId', 'email', '_id', '__v', 'createdAt', 'updatedAt'].includes(
                      key
                    )
                  ) {
                    return null;
                  }
                  const label = key
                    .replace(/([A-Z])/g, ' $1')
                    .replace(/^./, (c) => c.toUpperCase());

                  return (
                    <View style={styles.infoRow} key={key}>
                      <Text style={styles.infoLabel}>{label}:</Text>
                      <Text style={styles.infoValue}>
                        {Array.isArray(value)
                          ? value.join(', ')
                          : typeof value === 'string'
                          ? value
                          : String(value)}
                      </Text>
                    </View>
                  );
                })}
            </>
          )}
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