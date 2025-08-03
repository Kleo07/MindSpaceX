import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import { router } from 'expo-router';
import { useAssessment } from '../context/assessmentsContext';

const suggestions = ['Social Withdrawl', 'Feeling Numbness', 'Feeling Sad'];
const commonTags = ['Depressed', 'Angry'];

export default function OtherSymptomsScreen() {
  const [input, setInput] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const { setAssessment } = useAssessment();

  const handleAddTag = () => {
    const trimmed = input.trim();
    if (trimmed && tags.length < 10 && !tags.includes(trimmed)) {
      setTags([...tags, trimmed]);
      setInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setTags(tags.filter((t) => t !== tag));
  };

  const handleSuggestionPress = (suggestion: string) => {
    if (!tags.includes(suggestion) && tags.length < 10) {
      setTags([...tags, suggestion]);
    }
  };

  const handleContinue = () => {
    if (tags.length > 0) {
      setAssessment((prev) => ({ ...prev, otherSymptoms: tags }));
      router.push('/assessment/support');
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backIcon}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Assessment</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>10 of 14</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>
        Do you have other mental{"\n"}health symptoms?
      </Text>

      {/* Illustration */}
      <Image
        source={require('../../assets/images/symptoms-illustration.png')}
        style={styles.illustration}
        resizeMode="contain"
      />

      {/* Tag Entry Area */}
      <View style={styles.tagInputBox}>
        <ScrollView
          contentContainerStyle={styles.tagList}
          keyboardShouldPersistTaps="handled"
        >
          {tags.map((tag, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => handleRemoveTag(tag)}
              style={styles.tag}
            >
              <Text style={styles.tagText}>{tag}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TextInput
          value={input}
          onChangeText={setInput}
          placeholder="Add a symptom..."
          onSubmitEditing={handleAddTag}
          style={styles.textInput}
          placeholderTextColor="#A0A0A0"
        />

        <Text style={styles.counter}>{tags.length}/10</Text>
      </View>

      {/* Suggested Tags */}
      <View style={styles.suggestionsContainer}>
        <Text style={styles.suggestionLabel}>Most Common:</Text>
        {commonTags.map((tag, i) => (
          <TouchableOpacity
            key={i}
            style={styles.commonTag}
            onPress={() => handleSuggestionPress(tag)}
          >
            <Text style={styles.commonTagText}>{tag} ✕</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Continue Button */}
      <TouchableOpacity
        style={[
          styles.button,
          { opacity: tags.length > 0 ? 1 : 0.4 },
        ]}
        onPress={handleContinue}
        disabled={tags.length === 0}
      >
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FEFAF7',
    paddingHorizontal: 24,
    paddingTop: 60,
    paddingBottom: 30,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backIcon: {
    fontSize: 24,
    color: '#3e3e3e',
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#3e3e3e',
  },
  progressBadge: {
    backgroundColor: '#f3e5db',
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 15,
  },
  progressText: {
    fontSize: 12,
    color: '#5b4234',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#3e2d27',
    marginTop: 20,
    marginBottom: 20,
  },
  illustration: {
    width: '100%',
    height: 150,
    alignSelf: 'center',
    marginBottom: 20,
  },
  tagInputBox: {
    backgroundColor: '#F7FDF2',
    borderColor: '#CBE4AE',
    borderWidth: 2,
    borderRadius: 20,
    padding: 12,
    minHeight: 100,
    position: 'relative',
  },
  tagList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    backgroundColor: '#D8E8B5',
    borderRadius: 16,
    paddingHorizontal: 10,
    paddingVertical: 6,
    marginRight: 6,
    marginTop: 6,
  },
  tagText: {
    fontSize: 14,
    color: '#444',
  },
  textInput: {
    marginTop: 10,
    fontSize: 16,
    paddingVertical: 4,
    color: '#422B20',
  },
  counter: {
    position: 'absolute',
    bottom: 10,
    right: 12,
    fontSize: 12,
    color: '#7B7B7B',
  },
  suggestionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: 20,
    gap: 10,
  },
  suggestionLabel: {
    color: '#422B20',
    fontWeight: '500',
    marginRight: 6,
  },
  commonTag: {
    backgroundColor: '#F6A945',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  commonTagText: {
    color: '#fff',
    fontWeight: '500',
  },
  button: {
    backgroundColor: '#4a3b35',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 30,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});