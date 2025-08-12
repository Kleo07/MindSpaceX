// utils/api.ts
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth, useUser } from '@clerk/clerk-expo';

// Local dev (iOS simulator → your Node server on the same Mac)
export const BASE_URL = __DEV__ ? 'http://localhost:5050' : 'https://your-production-api.example.com';

// All assessment keys you store
export const ASSESSMENT_KEYS = [
  'goal',
  'gender',
  'age',
  'weight',
  'weightUnit',

  'mood',
  'moodEmoji',
  'moodIndex',

  'helpBefore',
  'distress',
  'sleepQuality',
  'medicationFrequency',

  'otherSymptoms',
  'supportLevel',
  'expressionText',
] as const;

type AssessmentKey = (typeof ASSESSMENT_KEYS)[number];
type AssessmentValue = string | number | string[];

export type AssessmentDoc = Partial<Record<AssessmentKey, AssessmentValue>> & {
  userId?: string;
  email?: string;
};

// remembers last logged-in user on this device
export const LAST_USER_KEY = 'assessment_last_user_id';

async function writeManyToStorage(data: AssessmentDoc) {
  const pairs: [string, string][] = [];
  for (const k of ASSESSMENT_KEYS) {
    const v = data[k];
    if (v === undefined || v === null) continue;
    pairs.push([`assessment_${k}`, Array.isArray(v) ? JSON.stringify(v) : String(v)]);
  }
  if (pairs.length) await AsyncStorage.multiSet(pairs);
}

export async function readAllFromStorage(): Promise<AssessmentDoc> {
  const entries = await AsyncStorage.multiGet(ASSESSMENT_KEYS.map((k) => `assessment_${k}`));
  const obj: AssessmentDoc = {};
  for (const [k, v] of entries) {
    if (v == null) continue;
    const key = k.replace('assessment_', '') as AssessmentKey;

    if (['age', 'weight', 'supportLevel', 'moodIndex'].includes(key)) {
      obj[key] = Number(v);
    } else if (key === 'otherSymptoms') {
      try {
        obj[key] = JSON.parse(v);
      } catch {
        obj[key] = [];
      }
    } else {
      obj[key] = v;
    }
  }
  return obj;
}

async function hasAnyLocalAssessment(): Promise<boolean> {
  const entries = await AsyncStorage.multiGet(ASSESSMENT_KEYS.map((k) => `assessment_${k}`));
  return entries.some(([, v]) => v != null);
}

export async function clearLocalAssessment() {
  const keys = ASSESSMENT_KEYS.map((k) => `assessment_${k}`);
  await AsyncStorage.multiRemove(keys);
}

export async function clearLastUserMarker() {
  await AsyncStorage.removeItem(LAST_USER_KEY);
}

export function useApi() {
  const { getToken } = useAuth();
  const { user } = useUser();

  const authHeaders = async () => {
    const token = await getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  // Save one step locally and upsert full snapshot to server
  const saveAssessmentStep = async (key: AssessmentKey, value: AssessmentValue) => {
    const toStore = Array.isArray(value) ? JSON.stringify(value) : String(value);
    await AsyncStorage.setItem(`assessment_${key}`, toStore);

    const local = await readAllFromStorage();
    const payload: AssessmentDoc = {
      ...local,
      userId: user?.id,
      email:
        user?.primaryEmailAddress?.emailAddress ??
        user?.emailAddresses?.[0]?.emailAddress ??
        '',
    };

    await axios.post(`${BASE_URL}/api/assessment/upsert`, payload, {
      headers: await authHeaders(),
    });
  };

  const saveAssessmentAll = async () => {
    const local = await readAllFromStorage();
    const payload: AssessmentDoc = {
      ...local,
      userId: user?.id,
      email:
        user?.primaryEmailAddress?.emailAddress ??
        user?.emailAddresses?.[0]?.emailAddress ??
        '',
    };

    await axios.post(`${BASE_URL}/api/assessment/upsert`, payload, {
      headers: await authHeaders(),
    });
  };

  const fetchAssessmentForUser = async (userId: string) => {
    const res = await axios.get<{ ok: boolean; data: AssessmentDoc | null }>(
      `${BASE_URL}/api/assessment/${userId}`,
      { headers: await authHeaders() }
    );
    return res.data.data;
  };

  /**
   * Call after login / when user changes.
   * If a different user logs in OR local cache is empty for the same user,
   * fetch from server; otherwise keep local.
   */
  const syncOnLogin = async () => {
    const currentUserId = user?.id;
    if (!currentUserId) return;

    const lastUserId = await AsyncStorage.getItem(LAST_USER_KEY);
    const localHasData = await hasAnyLocalAssessment();

    if (lastUserId !== currentUserId || !localHasData) {
      try {
        const remote = await fetchAssessmentForUser(currentUserId);
        if (remote) {
          await writeManyToStorage(remote);
        } else {
          await clearLocalAssessment();
        }
      } catch {
        await clearLocalAssessment();
      }
      await AsyncStorage.setItem(LAST_USER_KEY, currentUserId);
    }
  };

  return {
    saveAssessmentStep,
    saveAssessmentAll,
    fetchAssessmentForUser,
    syncOnLogin,
    readAllFromStorage,
    clearLocalAssessment,
    clearLastUserMarker,
    BASE_URL,
  };
}