import { ClerkProvider, useAuth } from '@clerk/clerk-expo';
import { Slot, usePathname } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';
import { AssessmentProvider } from './context/assessmentsContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import BottomNavBar from './components/BottomNavBar';
import { useEffect, useState } from 'react';

const tokenCache = {
  getToken: (key: string) => SecureStore.getItemAsync(key),
  saveToken: (key: string, value: string) => SecureStore.setItemAsync(key, value),
};

function LayoutWrapper() {
  const { isSignedIn } = useAuth();
  const pathname = usePathname();

  const showNavBar = isSignedIn && pathname !== '/splash';

  return (
    <>
      <Slot />
      {showNavBar && <BottomNavBar />}
    </>
  );
}

export default function RootLayout() {
  useWarmUpBrowser();

  return (
    <ClerkProvider
      publishableKey={process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!}
      tokenCache={tokenCache}
      sdkMetadata={{ name: 'mindspacex-app', version: '1.0.0' }}
    >
      <AssessmentProvider>
        <SafeAreaProvider>
          <LayoutWrapper />
        </SafeAreaProvider>
      </AssessmentProvider>
    </ClerkProvider>
  );
}