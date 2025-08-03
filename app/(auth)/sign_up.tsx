// app/(auth)/sign_up.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { AntDesign, MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useSignUp } from '@clerk/clerk-expo';

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp, setActive } = useSignUp();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [code, setCode] = useState('');
  const [pendingVerification, setPendingVerification] = useState(false);

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    if (password !== confirmPassword) {
      Alert.alert('Passwords do not match');
      return;
    }

    try {
      await signUp.create({ emailAddress: email, password });
      await signUp.prepareEmailAddressVerification({ strategy: 'email_code' });
      setPendingVerification(true);
    } catch (err: any) {
      Alert.alert('Error', err.errors?.[0]?.message || 'Failed to sign up');
    }
  };

  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const result = await signUp.attemptEmailAddressVerification({ code });

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId });
        router.replace('/');
      } else {
        Alert.alert('Verification incomplete. Try again.');
      }
    } catch (err: any) {
      Alert.alert('Verification Error', err.errors?.[0]?.message || 'Try again.');
    }
  };

  if (pendingVerification) {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => setPendingVerification(false)} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#4a3b35" />
        </TouchableOpacity>

        <View style={styles.curvedHeader}>
          <Image source={require('../../assets/images/msx-logo.png')} style={styles.logo} />
        </View>

        <Text style={styles.title}>Verify your Email</Text>

        <Text style={styles.label}>Verification Code</Text>
        <View style={styles.inputWrapper}>
          <MaterialIcons name="mail-outline" size={20} color="#4A3B35" />
          <TextInput
            style={styles.input}
            placeholder="Enter your verification code"
            placeholderTextColor="#666"
            keyboardType="numeric"
            value={code}
            onChangeText={setCode}
          />
        </View>

        <TouchableOpacity style={styles.signInButton} onPress={onVerifyPress}>
          <Text style={styles.signInText}>Verify</Text>
        </TouchableOpacity>

        <Text style={styles.signupHint}>
          Didn’t receive the code? Check your inbox or spam folder.
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.curvedHeader}>
        <Image source={require('../../assets/images/msx-logo.png')} style={styles.logo} />
      </View>

      <Text style={styles.title}>Sign Up For Free</Text>

      <Text style={styles.label}>Email Address</Text>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="alternate-email" size={20} color="#4A3B35" />
        <TextInput
          style={styles.input}
          placeholder="Enter your email..."
          placeholderTextColor="#666"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
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

      <Text style={styles.label}>Password Confirmation</Text>
      <View style={styles.inputWrapper}>
        <MaterialIcons name="lock" size={20} color="#4A3B35" />
        <TextInput
          style={styles.input}
          placeholder="Confirm your password..."
          placeholderTextColor="#666"
          secureTextEntry
          value={confirmPassword}
          onChangeText={setConfirmPassword}
        />
        <MaterialIcons name="visibility-off" size={20} color="#aaa" />
      </View>

      <TouchableOpacity style={styles.signInButton} onPress={onSignUpPress}>
        <Text style={styles.signInText}>Sign Up →</Text>
      </TouchableOpacity>

      <Text style={styles.signupHint}>
        Already have an account?{' '}
        <Text style={styles.signupLink} onPress={() => router.push('/sign_in')}>
          Sign In.
        </Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefaf7',
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  curvedHeader: {
    height: 120,
    backgroundColor: '#fefaf7',
    borderBottomLeftRadius: 100,
    borderBottomRightRadius: 100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 24,
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