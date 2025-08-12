import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useRouter, useRootNavigationState } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function SplashScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  // Ensure the root navigator is mounted before navigating
  const navState = useRootNavigationState();
  const navReady = !!navState?.key;

  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();
  }, [scaleAnim]);

  useEffect(() => {
    if (!isLoaded || !navReady) return;

    if (isSignedIn) {
      router.replace('/(profile)');
    } else {
      router.replace('/login');
    }
  }, [isLoaded, navReady, isSignedIn, router]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/msx-logo.png')}
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
      />
      <Text style={styles.text}>mindspaceX</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fefaf7',
  },
  logo: {
    width: 120, height: 120, marginBottom: 16,
  },
  text: {
    fontSize: 20, fontWeight: '600', color: '#1a1a1a',
  },
});