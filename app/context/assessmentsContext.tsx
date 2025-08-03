// app/context/assessmentsContext.tsx
import React, { createContext, useContext, useState } from 'react';

export type AssessmentData = {
  expressionText?: string;
  
  // shto të tjera nëse ke: goal, gender, age, weight, sleepQuality, etj.
};

type AssessmentContextType = {
  assessment: AssessmentData;
  setAssessment: React.Dispatch<React.SetStateAction<AssessmentData>>;
};

const AssessmentContext = createContext<AssessmentContextType | undefined>(undefined);

export const AssessmentProvider = ({ children }: { children: React.ReactNode }) => {
  const [assessment, setAssessment] = useState<AssessmentData>({});

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