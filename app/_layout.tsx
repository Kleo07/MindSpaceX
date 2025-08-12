// app/_layout.tsx
import { ClerkProvider, useAuth, useUser } from '@clerk/clerk-expo';
import { Slot, usePathname } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useWarmUpBrowser } from '../hooks/useWarmUpBrowser';
import BottomNavBar from './components/BottomNavBar';
import AssessmentProvider from './context/assessmentsContext'; // default export
import React from 'react';
import { useApi } from '../utils/api';

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

// Ensure per-user sync happens after login
function SyncOnLogin() {
  const { isSignedIn } = useAuth();
  const { user, isLoaded } = useUser();
  const { syncOnLogin } = useApi();

  React.useEffect(() => {
    if (isLoaded && isSignedIn && user?.id) {
      syncOnLogin();
    }
  }, [isLoaded, isSignedIn, user?.id]);

  return null;
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
          <SyncOnLogin />
          <LayoutWrapper />
        </SafeAreaProvider>
      </AssessmentProvider>
    </ClerkProvider>
  );
}