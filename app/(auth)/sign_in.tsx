import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useSignIn, useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const { user, isLoaded: userLoaded } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // Nëse përdoruesi është i loguar ridrejto automatikisht
  useEffect(() => {
    if (userLoaded && user) {
      router.replace('/(profile)/ProfileSetupScreen');
    }
  }, [user, userLoaded]);

  const onSignIn = async () => {
    if (!signIn || !isLoaded) return;

    try {
      // Nëse sesioni ekziston, mos bëj login përsëri
      if (user) {
        router.replace('/(profile)');
        return;
      }

      const result = await signIn.create({ identifier: email, password });
      await setActive({ session: result.createdSessionId });
      router.replace('/(profile)');
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Failed to sign in.');
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={24} color="#333" />
      </TouchableOpacity>

      <Text style={styles.title}>Sign In To mindspaceX</Text>

      <Text style={styles.label}>Email Address</Text>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="alternate-email" size={20} color="#4A3B35" />
        <TextInput
          style={styles.input}
          placeholder="example@gmail.com"
          placeholderTextColor="#666"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
        />
      </View>

      <Text style={styles.label}>Password</Text>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="lock" size={20} color="#4A3B35" />
        <TextInput
          style={styles.input}
          placeholder="Enter your password..."
          placeholderTextColor="#666"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <MaterialIcons name="visibility-off" size={20} color="#aaa" />
      </View>

      <TouchableOpacity style={{ alignSelf: 'flex-end', marginTop: 6 }}>
        <Text style={styles.link}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.signInButton} onPress={onSignIn}>
        <Text style={styles.signInText}>Sign In →</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity
        style={styles.googleButton}
        onPress={() => Alert.alert('Google Sign In', 'Coming soon')}
      >
        <AntDesign name="google" size={20} style={{ marginRight: 8 }} />
        <Text style={styles.googleText}>Sign In with Google</Text>
      </TouchableOpacity>

      <Text style={styles.signupHint}>
        Don’t have an account?{' '}
        <Text style={styles.signupLink} onPress={() => router.push('/sign_up')}>
          Sign Up.
        </Text>
      </Text>
    </View>
  );
}

// styles me i njejti si ke pasur
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefaf7',
    paddingHorizontal: 24,
    paddingTop: 80,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 10,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#4a3b35',
    marginBottom: 30,
  },
  label: {
    fontWeight: '600',
    color: '#4a3b35',
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 50,
    marginBottom: 16,
    borderColor: '#ccc',
    borderWidth: 1,
  },
  input: {
    flex: 1,
    marginLeft: 10,
    fontSize: 15,
    color: '#333',
  },
  link: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 13,
  },
  signInButton: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
    marginTop: 20,
  },
  signInText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
  orText: {
    textAlign: 'center',
    marginVertical: 16,
    fontWeight: '600',
  },
  googleButton: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 50,
    paddingVertical: 14,
    paddingHorizontal: 24,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  googleText: {
    fontWeight: '600',
    fontSize: 15,
  },
  signupHint: {
    textAlign: 'center',
    marginTop: 30,
    color: '#666',
  },
  signupLink: {
    color: '#e96c00',
    fontWeight: '600',
  },
});