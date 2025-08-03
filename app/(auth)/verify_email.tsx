// app/(auth)/verify_email.tsx
import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import { useSignUp } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'

export default function VerifyEmailScreen() {
  const { isLoaded, signUp, setActive } = useSignUp()
  const router = useRouter()
  const [code, setCode] = useState('')

  const onVerifyPress = async () => {
    if (!isLoaded) return
    try {
      const result = await signUp.attemptEmailAddressVerification({ code })

      if (result.status === 'complete') {
        await setActive({ session: result.createdSessionId })
        router.replace('/')
      } else {
        Alert.alert('Verification Incomplete', 'Please try again or check your email.')
      }
    } catch (err: any) {
      Alert.alert('Verification Error', err.errors?.[0]?.message || 'Something went wrong.')
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verify your Email</Text>
      <Text style={styles.subtitle}>Enter the 6-digit code sent to your email</Text>

      <TextInput
        value={code}
        onChangeText={setCode}
        placeholder="Enter your verification code"
        keyboardType="number-pad"
        style={styles.input}
        maxLength={6}
      />

      <TouchableOpacity onPress={onVerifyPress} style={styles.button}>
        <Text style={styles.buttonText}>Verify</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefaf7',
    paddingHorizontal: 24,
    paddingTop: 80,
    justifyContent: 'flex-start',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#4a3b35',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    textAlign: 'center',
    color: '#555',
    marginBottom: 40,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 50,
    paddingHorizontal: 20,
    paddingVertical: 14,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ccc',
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
  },
  button: {
    backgroundColor: '#000',
    paddingVertical: 16,
    borderRadius: 50,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
})