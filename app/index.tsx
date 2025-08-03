// app/index.tsx
import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { View, Text, StyleSheet, Animated, Image } from 'react-native';

export default function SplashScreen() {
  const router = useRouter();
  const scaleAnim = new Animated.Value(0);

  useEffect(() => {
    Animated.spring(scaleAnim, {
      toValue: 1,
      useNativeDriver: true,
      friction: 5,
    }).start();

    const timeout = setTimeout(() => {
      router.replace('/login');
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

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