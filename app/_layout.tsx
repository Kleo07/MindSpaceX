import { Slot } from 'expo-router';
import { ClerkProvider } from '@clerk/clerk-expo';
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';
import { AssessmentProvider } from './context/assessmentsContext';

export default function RootLayout() {
  useWarmUpBrowser();

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      sdkMetadata={{ name: 'mindspacex-app', version: '1.0.0' }}
    >
      <AssessmentProvider>
        <Slot />
      </AssessmentProvider>
    </ClerkProvider>
  );
}