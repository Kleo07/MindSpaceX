import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';
import { useClerk } from '@clerk/clerk-expo';

export default function SignOutButton() {
  const clerk = useClerk();

  const handleSignOut = async () => {
    try {
      await clerk.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleSignOut}>
      <Text style={styles.text}>Sign Out</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    marginTop: 40,
    backgroundColor: '#000',
    paddingVertical: 12,
    paddingHorizontal: 50,
    borderRadius: 30,
  },
  text: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});