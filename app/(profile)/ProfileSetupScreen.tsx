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
      try {
        const avatarIndex = await AsyncStorage.getItem('selectedAvatar');
        const photoUri = await AsyncStorage.getItem('customPhoto');
        if (avatarIndex !== null) setSelectedAvatar(parseInt(avatarIndex, 10));
        if (photoUri) setCustomImage(photoUri);
      } catch (e) {
        console.log('Failed to load profile:', e);
      }
    };
    loadProfile();
  }, []);

  const requestPermission = async () => {
    if (Platform.OS !== 'web') {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission needed', 'Please allow access to your photos to upload profile picture.');
        return false;
      }
    }
    return true;
  };

  const pickImage = async () => {
    const hasPermission = await requestPermission();
    if (!hasPermission) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        setCustomImage(uri);
        setSelectedAvatar(null);
        await AsyncStorage.setItem('customPhoto', uri);
        await AsyncStorage.removeItem('selectedAvatar');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to select image.');
      console.error(error);
    }
  };

  const selectAvatar = async (index: number) => {
    setSelectedAvatar(index);
    setCustomImage(null);
    await AsyncStorage.setItem('selectedAvatar', index.toString());
    await AsyncStorage.removeItem('customPhoto');
  };

  const goToProfile = () => {
    router.push('/(profile)');
  };

  const isNextEnabled = selectedAvatar !== null || customImage !== null;

  return (
    <View style={styles.container}>
      {/* Back Button */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <AntDesign name="arrowleft" size={28} color="#4a3b35" />
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Profile Setup</Text>
      <Text style={styles.subtitle}>Choose your avatar or upload a photo</Text>

      {/* Avatar list */}
      <FlatList
        horizontal
        data={avatars}
        keyExtractor={(_, i) => i.toString()}
        renderItem={({ item, index }) => (
          <TouchableOpacity
            onPress={() => selectAvatar(index)}
            style={[
              styles.avatarWrapper,
              selectedAvatar === index && styles.avatarSelected,
            ]}
            activeOpacity={0.7}
          >
            <Text style={styles.avatarEmoji}>{item}</Text>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.avatarList}
        showsHorizontalScrollIndicator={false}
      />

      {/* Upload Button */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadButtonText}>+ Upload your profile photo</Text>
      </TouchableOpacity>

      {/* Preview */}
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

      {/* Next Step Button */}
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
  container: {
    flex: 1,
    backgroundColor: '#f7f3f0',
    paddingTop: 70,
    paddingHorizontal: 20,
    alignItems: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    zIndex: 10,
  },
  backText: {
    fontSize: 18,
    color: '#4a3b35',
    fontWeight: '600',
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#4a3b35',
  },
  subtitle: {
    fontSize: 16,
    color: '#4a3b35',
    marginTop: 6,
    marginBottom: 140,
    textAlign: 'center',
  },
  avatarList: {
    paddingHorizontal: 10,
  },
  avatarWrapper: {
    height: 200,
    marginHorizontal: 12,
    padding: 16,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#dfe7ce',
  },
  avatarSelected: {
    borderColor: '#4a3b35',
    backgroundColor: '#a9c987',
  },
  avatarEmoji: {
    fontSize: 48,
  },
  uploadButton: {
    marginTop: 30,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 30,
    backgroundColor: '#4a3b35',
  },
  uploadButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  previewContainer: {
    marginTop: 40,
    alignItems: 'center',
  },
  previewLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4a3b35',
    marginBottom: 14,
  },
  customImage: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#4a3b35',
  },
  emojiPreviewWrapper: {
    width: 140,
    height: 140,
    borderRadius: 70,
    borderWidth: 3,
    borderColor: '#4a3b35',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#b3d36eff',
    marginVertical: 40,
  },
  emojiPreview: {
    fontSize: 90,
  },
  noSelectionText: {
    fontSize: 16,
    color: '#999',
  },
  nextButton: {
    marginTop: 40,
    paddingVertical: 14,
    paddingHorizontal: 60,
    borderRadius: 30,
    backgroundColor: '#4a3b35',
  },
  nextButtonDisabled: {
    backgroundColor: '#999',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
});