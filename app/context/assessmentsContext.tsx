import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type AssessmentData = {
  goal?: string;
  mood?: string;
  sleepQuality?: string;
  medication?: string;
  expressionText?: string;
  gender?: string;
  age?: number;
  weight?: number;
  support?: string;
  distress?: string;
  symptoms?: string;
  help?: string;
};

type AssessmentContextType = {
  assessment: AssessmentData;
  setAssessment: React.Dispatch<React.SetStateAction<AssessmentData>>;
};

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider = ({ children }: { children: React.ReactNode }) => {
  const [assessment, setAssessment] = useState<AssessmentData>({});

  useEffect(() => {
    const persistAssessment = async () => {
      try {
        const entries = Object.entries(assessment)
          .filter(([_, value]) => value !== undefined && value !== null && value !== '')
          .map(([key, value]) => [`assessment_${key}`, String(value)]);

        if (entries.length > 0) {
          await AsyncStorage.multiSet(entries as [string, string][]); // ✅ FIXED TYPE
        }
      } catch (err) {
        console.warn('Error saving assessment data:', err);
      }
    };

    persistAssessment();
  }, [assessment]);

  return (
    <AssessmentContext.Provider value={{ assessment, setAssessment }}>
      {children}
    </AssessmentContext.Provider>
  );
};

export const useAssessment = () => {
  const context = useContext(AssessmentContext);
  if (!context) {
    throw new Error('useAssessment must be used within AssessmentProvider');
  }
  return context;
};