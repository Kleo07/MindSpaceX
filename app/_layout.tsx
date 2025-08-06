import { ClerkProvider } from '@clerk/clerk-expo';
import { Slot } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';
import { AssessmentProvider } from './context/assessmentsContext';

// ✅ Krijo tokenCache manualisht për Clerk
const tokenCache = {
  getToken: (key: string) => SecureStore.getItemAsync(key),
  saveToken: (key: string, value: string) => SecureStore.setItemAsync(key, value),
};

export default function RootLayout() {
  useWarmUpBrowser();

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache} // ✅ tani punon
      sdkMetadata={{ name: 'mindspacex-app', version: '1.0.0' }}
    >
      <AssessmentProvider>
        <Slot />
      </AssessmentProvider>
    </ClerkProvider>
  );
}