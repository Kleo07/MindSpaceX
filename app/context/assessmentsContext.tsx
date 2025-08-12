import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth, useUser } from '@clerk/clerk-expo';
import { useApi } from '../../utils/api';

type AssessmentState = {
  goal?: string;
  gender?: string;
  age?: number;
  weight?: number;
  weightUnit?: string;
  mood?: string;
  moodEmoji?: string;
  moodIndex?: number;
  helpBefore?: string;
  supportLevel?: number;
  distress?: string;
  sleepQuality?: string;
  medicationFrequency?: string;
  otherSymptoms?: string[];
  expressionText?: string;
  ai?: string;
  summary?: string;
};

type Ctx = {
  assessment: AssessmentState;
  setAssessment: React.Dispatch<React.SetStateAction<AssessmentState>>;
  clearAssessment: () => Promise<void>;
};

const AssessmentContext = createContext<Ctx | undefined>(undefined);

function makePrefix(userId?: string | null) {
  // keep each user's local storage isolated
  return userId ? `assessment_${userId}_` : `assessment_guest_`;
}

const STORAGE_KEYS: (keyof AssessmentState)[] = [
  'goal',
  'gender',
  'age',
  'weight',
  'weightUnit',
  'mood',
  'moodEmoji',
  'moodIndex',
  'helpBefore',
  'supportLevel',
  'distress',
  'sleepQuality',
  'medicationFrequency',
  'otherSymptoms',
  'expressionText',
  'ai',
  'summary',
];

const AssessmentProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const { user } = useUser();
  const prefix = useMemo(() => makePrefix(user?.id), [user?.id]);

  const [assessment, setAssessment] = useState<AssessmentState>({});
  const { saveAssessmentStep } = useApi();

  const lastUserId = useRef<string | undefined>(undefined);

  // Load from storage when user changes (prevents seeing previous user’s data)
  useEffect(() => {
    let alive = true;

    (async () => {
      try {
        const entries = await AsyncStorage.multiGet(
          STORAGE_KEYS.map(k => `${prefix}${k}`)
        );

        const next: AssessmentState = {};
        for (const [k, v] of entries) {
          if (v == null) continue;
          const key = k.replace(prefix, '') as keyof AssessmentState;

          if (['age', 'weight', 'supportLevel', 'moodIndex'].includes(key)) {
            (next as any)[key] = Number(v);
          } else if (key === 'otherSymptoms') {
            try { (next as any)[key] = JSON.parse(v); } catch { (next as any)[key] = []; }
          } else {
            (next as any)[key] = v;
          }
        }

        if (alive) setAssessment(next);
      } catch (e) {
        // fail-soft
      }
    })();

    lastUserId.current = user?.id;
    return () => { alive = false; };
  }, [prefix, user?.id]);

  // Persist to storage (per-user) whenever state changes
  useEffect(() => {
    (async () => {
      const pairs: [string, string][] = [];

      for (const k of STORAGE_KEYS) {
        const value = (assessment as any)[k];
        if (value === undefined) continue;

        if (Array.isArray(value)) {
          pairs.push([`${prefix}${k}`, JSON.stringify(value)]);
        } else {
          pairs.push([`${prefix}${k}`, String(value)]);
        }
      }

      if (pairs.length) {
        try {
          await AsyncStorage.multiSet(pairs);
        } catch {}
      }
    })();
  }, [assessment, prefix]);

  // Convenience: when developer wants to wipe current user’s local cache
  const clearAssessment = async () => {
    try {
      await AsyncStorage.multiRemove(STORAGE_KEYS.map(k => `${prefix}${k}`));
    } catch {}
    setAssessment({});
  };

  const value = useMemo(() => ({
    assessment,
    setAssessment: (updater: React.SetStateAction<AssessmentState>) => {
      setAssessment(prev => {
        const next = typeof updater === 'function' ? (updater as any)(prev) : updater;
        // Optionally push single-field updates to API if you’re doing them one at a time elsewhere
        return next;
      });
    },
    clearAssessment,
  }), [assessment]);

  return (
    <AssessmentContext.Provider value={value}>
      {children}
    </AssessmentContext.Provider>
  );
};

export default AssessmentProvider;

export function useAssessment() {
  const ctx = useContext(AssessmentContext);
  if (!ctx) {
    throw new Error('useAssessment must be used within <AssessmentProvider>');
  }
  return ctx;
}