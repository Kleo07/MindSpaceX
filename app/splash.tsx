import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@clerk/clerk-expo';

export default function SplashScreen() {
  const router = useRouter();
  const { isSignedIn, isLoaded } = useAuth();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Animate logo
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
      tension: 80,
    }).start();

    // Delay and redirect based on auth state
    const timeout = setTimeout(() => {
      if (!isLoaded) return; // Wait until Clerk finishes loading

      if (isSignedIn) {
        router.replace('/(profile)/ProfileSetupScreen'); // ✅ User is signed in
      } else {
        router.replace('/login'); // ❌ Not signed in → go to login
      }
    }, 2500);

    return () => clearTimeout(timeout);
  }, [isLoaded, isSignedIn]);

  return (
    <View style={styles.container}>
      <Animated.Image
        source={require('../assets/images/msx-logo.png')}
        style={[styles.logo, { transform: [{ scale: scaleAnim }] }]}
        resizeMode="contain"
      />
      <Text style={styles.text}>mindspaceX</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f4f3',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 120,
    height: 120,
    marginBottom: 16,
  },
  text: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a1a1a',
  },
});