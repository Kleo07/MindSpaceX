// app/login.tsx
import { useRouter } from 'expo-router';
import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const LoginScreen = () => {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/images/msx-logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <Text style={styles.title}>Welcome to the ultimate{"\n"}mindspaceX</Text>
      <Text style={styles.subtitle}>
        Designed to support and empower young individuals struggling with mental wellness
      </Text>

      <Image
        source={require('../assets/images/1.png')}
        style={styles.illustration}
        resizeMode="contain"
      />

      <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/sign_up')}>
        <Text style={styles.buttonText}>Sign Up →</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => router.push('./(auth)/sign_in')}>
        <Text style={styles.signin}>Already have an account? <Text style={{ color: '#EF7D00' }}>Sign In.</Text></Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const { width, height } = Dimensions.get('window');

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f7f4f3',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 60,
    paddingHorizontal: 20,
  },
  logo: {
    width: 40,
    height: 40,
    marginBottom: 16,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    fontWeight: '700',
    color: '#3d2c29',
    marginBottom: 12,
  },
  subtitle: {
    textAlign: 'center',
    fontSize: 14,
    color: '#7B7B7B',
    marginBottom: 30,
    lineHeight: 20,
  },
  illustration: {
    width: width * 0.8,
    height: height * 0.35,
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#000',
    borderRadius: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
    marginBottom: 16,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  signin: {
    fontSize: 14,
    color: '#7B7B7B',
    marginTop: 8,
  },
});