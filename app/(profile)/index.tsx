import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';

const accountTypes = ['Psychiatrist', 'Patient', 'Professional'];
const genders = ['Male', 'Female', 'Trans Female', 'Trans Male', 'Other'];
const locations = ['Tokyo, Japan', 'New York, USA', 'London, UK', 'Other'];

export default function ProfileScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [fullName, setFullName] = useState(user?.fullName || '');
  const [email] = useState(user?.emailAddresses?.[0]?.emailAddress || '');
  const [password, setPassword] = useState('**********');
  const [accountType, setAccountType] = useState('Patient');
  const [weight, setWeight] = useState(65);
  const [gender, setGender] = useState('Trans Female');
  const [location, setLocation] = useState('Tokyo, Japan');
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <ScrollView style={styles.container} contentContainerStyle={{padding: 20}}>
      <Text style={styles.headerTitle}>Profile Setup</Text>

      <View style={styles.photoCircle}>
        <Text style={{ fontSize: 48 }}>😊</Text>
      </View>

      <Text style={styles.label}>Full Name</Text>
      <TextInput
        style={styles.input}
        value={fullName}
        onChangeText={setFullName}
        placeholder="Enter your full name"
      />

      <Text style={styles.label}>Email Address</Text>
      <TextInput
        style={[styles.input, { backgroundColor: '#f0f0f0' }]}
        value={email}
        editable={false}
      />

      <Text style={styles.label}>Password</Text>
      <View style={styles.passwordWrapper}>
        <TextInput
          style={[styles.input, { flex: 1 }]}
          value={password}
          secureTextEntry={!passwordVisible}
          onChangeText={setPassword}
        />
        <TouchableOpacity
          onPress={() => setPasswordVisible(!passwordVisible)}
          style={styles.showPasswordBtn}
        >
          <Text style={{ color: '#4a3b35' }}>{passwordVisible ? 'Hide' : 'Show'}</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Account Type</Text>
      <View style={styles.accountTypeContainer}>
        {accountTypes.map((type) => (
          <TouchableOpacity
            key={type}
            style={[
              styles.accountTypeBtn,
              accountType === type && styles.accountTypeBtnSelected,
            ]}
            onPress={() => setAccountType(type)}
          >
            <Text
              style={[
                styles.accountTypeText,
                accountType === type && { color: '#fff' },
              ]}
            >
              {type}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Weight: {weight} kg</Text>
      <View style={styles.sliderContainer}>
        <TouchableOpacity
          style={styles.sliderBtn}
          onPress={() => setWeight(Math.max(50, weight - 1))}
        >
          <Text style={styles.sliderBtnText}>-</Text>
        </TouchableOpacity>
        <View style={styles.weightValueContainer}>
          <Text style={styles.weightValue}>{weight}</Text>
        </View>
        <TouchableOpacity
          style={styles.sliderBtn}
          onPress={() => setWeight(Math.min(100, weight + 1))}
        >
          <Text style={styles.sliderBtnText}>+</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.label}>Gender</Text>
      <View style={styles.dropdownContainer}>
        {genders.map((g) => (
          <TouchableOpacity
            key={g}
            style={[
              styles.dropdownBtn,
              gender === g && styles.dropdownBtnSelected,
            ]}
            onPress={() => setGender(g)}
          >
            <Text
              style={[
                styles.dropdownText,
                gender === g && { color: '#fff' },
              ]}
            >
              {g}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Location</Text>
      <View style={styles.dropdownContainer}>
        {locations.map((loc) => (
          <TouchableOpacity
            key={loc}
            style={[
              styles.dropdownBtn,
              location === loc && styles.dropdownBtnSelected,
            ]}
            onPress={() => setLocation(loc)}
          >
            <Text
              style={[
                styles.dropdownText,
                location === loc && { color: '#fff' },
              ]}
            >
              {loc}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.continueBtn} onPress={() => alert('Continue pressed')}>
        <Text style={styles.continueBtnText}>Continue →</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9f8f5',
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#4a3b35',
    marginBottom: 10,
  },
  photoCircle: {
    alignSelf: 'center',
    backgroundColor: '#e6edd8',
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 18,
  },
  label: {
    fontWeight: '600',
    color: '#4a3b35',
    marginLeft: 12,
    marginBottom: 6,
    fontSize: 16,
  },
  input: {
    backgroundColor: 'white',
    borderColor: '#c1bda9',
    borderWidth: 1,
    borderRadius: 30,
    height: 45,
    paddingHorizontal: 20,
    marginBottom: 14,
    color: '#4a3b35',
  },
  passwordWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },
  showPasswordBtn: {
    paddingHorizontal: 15,
  },
  accountTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  accountTypeBtn: {
    borderWidth: 1,
    borderColor: '#4a3b35',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 90,
    alignItems: 'center',
  },
  accountTypeBtnSelected: {
    backgroundColor: '#a9c987',
    borderColor: '#a9c987',
  },
  accountTypeText: {
    color: '#4a3b35',
    fontWeight: '600',
  },
  sliderContainer: {
    flexDirection: 'row',
    marginBottom: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sliderBtn: {
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#4a3b35',
    paddingVertical: 6,
    paddingHorizontal: 16,
  },
  sliderBtnText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4a3b35',
  },
  weightValueContainer: {
    marginHorizontal: 20,
    minWidth: 40,
    alignItems: 'center',
  },
  weightValue: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a3b35',
  },
  dropdownContainer: {
    flexDirection: 'row',
    marginBottom: 16,
    flexWrap: 'wrap',
    gap: 12,
  },
  dropdownBtn: {
    borderWidth: 1,
    borderColor: '#4a3b35',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 20,
    minWidth: 90,
    alignItems: 'center',
    marginRight: 10,
  },
  dropdownBtnSelected: {
    backgroundColor: '#a9c987',
    borderColor: '#a9c987',
  },
  dropdownText: {
    color: '#4a3b35',
    fontWeight: '600',
  },
  continueBtn: {
    backgroundColor: '#4a3b35',
    borderRadius: 30,
    paddingVertical: 16,
    marginTop: 20,
    alignItems: 'center',
  },
  continueBtnText: {
    fontWeight: '700',
    color: 'white',
    fontSize: 18,
  },
});