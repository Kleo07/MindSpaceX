import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  Image,
  Alert,
  Platform,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { AntDesign } from '@expo/vector-icons';

const avatars = ['😀', '😎', '😇', '🤓', '🥳', '😜'];

export default function ProfileSetupScreen() {
  const router = useRouter();
  const [selectedAvatar, setSelectedAvatar] = useState<number | null>(null);
  const [customImage, setCustomImage] = useState<string | null>(null);

  useEffect(() => {
    const loadProfile = async () => {
      const avatarIndex = await AsyncStorage.getItem('selectedAvatar');
      const photoUri = await AsyncStorage.getItem('customPhoto');
      if (avatarIndex !== null) setSelectedAvatar(parseInt(avatarIndex, 10));
      if (photoUri) setCustomImage(photoUri);
    };
    loadProfile();
  }, []);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images });
    if (!result.canceled) {
      const uri = result.assets[0].uri;
      setCustomImage(uri);
      setSelectedAvatar(null);
      await AsyncStorage.setItem('customPhoto', uri);
      await AsyncStorage.removeItem('selectedAvatar');
    }
  };

  const selectAvatar = async (index: number) => {
    setSelectedAvatar(index);
    setCustomImage(null);
    await AsyncStorage.setItem('selectedAvatar', index.toString());
    await AsyncStorage.removeItem('customPhoto');
  };

  const goToProfile = () => router.push('/(profile)');

  const isNextEnabled = selectedAvatar !== null || customImage !== null;

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={28} color="#4a3b35" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Profile Setup</Text>
      <Text style={styles.subtitle}>Choose your avatar or upload a photo</Text>

      <FlatList
        horizontal
        data={avatars}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => selectAvatar(index)}
            style={[styles.avatarWrapper, selectedAvatar === index && styles.avatarSelected]}
          >
            <Text style={styles.avatarEmoji}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.avatarList}
        showsHorizontalScrollIndicator={false}
      />

      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>+ Upload your profile photo</Text>
      </TouchableOpacity>

      <View style={styles.previewContainer}>
        <Text style={styles.previewLabel}>Selected Profile Image</Text>
        {customImage ? (
          <Image source={{ uri: customImage }} style={styles.customImage} />
        ) : selectedAvatar !== null ? (
          <View style={styles.emojiPreviewWrapper}>
            <Text style={styles.emojiPreview}>{avatars[selectedAvatar]}</Text>
          </View>
        ) : (
          <Text style={styles.noSelectionText}>No avatar or photo selected yet.</Text>
        )}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, !isNextEnabled && styles.nextButtonDisabled]}
        onPress={goToProfile}
        disabled={!isNextEnabled}
      >
        <Text style={styles.nextButtonText}>Next Step</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7f3f0', paddingTop: 70, paddingHorizontal: 20, alignItems: 'center' },
  backButton: { position: 'absolute', top: 50, left: 20, flexDirection: 'row', alignItems: 'center', gap: 6 },
  backText: { fontSize: 18, color: '#4a3b35', fontWeight: '600' },
  title: { fontSize: 26, fontWeight: '700', color: '#4a3b35' },
  subtitle: { fontSize: 16, color: '#4a3b35', marginTop: 6, marginBottom: 40, textAlign: 'center' },
  avatarList: { paddingHorizontal: 10 },
  avatarWrapper: { height: 100, width: 80, marginHorizontal: 8, borderRadius: 30, justifyContent: 'center', alignItems: 'center', backgroundColor: '#dfe7ce' },
  avatarSelected: { backgroundColor: '#a9c987', borderWidth: 2, borderColor: '#4a3b35' },
  avatarEmoji: { fontSize: 36 },
  uploadButton: { marginTop: 20, paddingVertical: 12, paddingHorizontal: 32, borderRadius: 30, backgroundColor: '#4a3b35' },
  uploadButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  previewContainer: { marginTop: 30, alignItems: 'center' },
  previewLabel: { fontSize: 16, fontWeight: '600', color: '#4a3b35', marginBottom: 14 },
  customImage: { width: 140, height: 140, borderRadius: 70, borderWidth: 3, borderColor: '#4a3b35' },
  emojiPreviewWrapper: { width: 140, height: 140, borderRadius: 70, borderWidth: 3, borderColor: '#4a3b35', justifyContent: 'center', alignItems: 'center', backgroundColor: '#b3d36eff' },
  emojiPreview: { fontSize: 90 },
  noSelectionText: { fontSize: 16, color: '#999' },
  nextButton: { marginTop: 40, paddingVertical: 14, paddingHorizontal: 60, borderRadius: 30, backgroundColor: '#4a3b35', marginBottom: 30 },
  nextButtonDisabled: { backgroundColor: '#999' },
  nextButtonText: { color: '#fff', fontSize: 18, fontWeight: '700' },
});