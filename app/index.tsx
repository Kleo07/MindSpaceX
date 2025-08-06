import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { useUser } from '@clerk/clerk-expo';

export default function SplashScreen() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useUser();
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();

    if (isLoaded) {
      if (isSignedIn) {
        router.replace('/(profile)'); // Nese i loguar, shko direkt ne profil
      } else {
        router.replace('/login'); // Nese jo i loguar, shko te login
      }
    }
  }, [isLoaded, isSignedIn]);

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