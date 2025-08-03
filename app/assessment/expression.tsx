import React, { useState, useEffect, useRef } from 'react';
import {
  View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import Voice from '@react-native-voice/voice';
import { FontAwesome } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useAssessment } from '../context/assessmentsContext';

const MAX_LENGTH = 250;
const FILLER_WORDS = ['uh', 'um', 'hmm', 'ok', 'okay', 'like'];

export default function ExpressionScreen() {
  const [text, setText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const saveTimer = useRef<ReturnType<typeof setInterval> | null>(null);
  const { setAssessment } = useAssessment();
  const lastPhrase = useRef<string>('');

  useEffect(() => {
    Voice.onSpeechResults = ({ value }) => {
      if (!value || !value[0]) return;
      let newText = value[0].toLowerCase();

      newText = newText
        .split(' ')
        .filter(word => !FILLER_WORDS.includes(word.toLowerCase()))
        .join(' ')
        .trim();

      if (newText === lastPhrase.current) return;
      lastPhrase.current = newText;

      setText(prev => {
        const combined = `${prev.trim()} ${newText}`.trim();
        return combined.length > MAX_LENGTH ? combined.slice(0, MAX_LENGTH) : combined;
      });
    };

    Voice.onSpeechEnd = () => {
      if (isListening) {
        Voice.start('en-US'); // Rifillon automatikisht
      }
    };

    Voice.onSpeechError = (e) => {
      console.error('Voice Error:', e);
      setIsListening(false);
    };

    return () => {
      Voice.destroy().then(Voice.removeAllListeners);
      if (saveTimer.current) clearInterval(saveTimer.current);
    };
  }, [isListening]);

  useEffect(() => {
    saveTimer.current = setInterval(() => {
      setAssessment(prev => ({
        ...prev,
        expressionText: text.trim()
      }));
    }, 3000);

    return () => {
      if (saveTimer.current) clearInterval(saveTimer.current);
    };
  }, [text]);

  const startListening = async () => {
    try {
      await Voice.start('en-US');
      setIsListening(true);
    } catch (e) {
      Alert.alert('Error', 'Could not access microphone');
    }
  };

  const stopListening = async () => {
    try {
      await Voice.stop();
    } catch (e) {
      console.error('Stop Error:', e);
    } finally {
      setIsListening(false);
    }
  };

  const handleContinue = () => {
    if (!text.trim()) return;
    setAssessment(prev => ({ ...prev, expressionText: text.trim() }));
    router.push('/assessment/summary');
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
          <Text style={styles.progressText}>13 of 14</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>Expression Analysis</Text>
      <Text style={styles.subtitle}>
        Freely write down anything that's on your{"\n"}mind. Dr Freud.ai is here to listen…
      </Text>

      {/* Input */}
      <View style={styles.textBox}>
        <TextInput
          value={text}
          onChangeText={setText}
          placeholder="Type your thoughts here..."
          placeholderTextColor="#aaa"
          multiline
          maxLength={MAX_LENGTH}
          style={styles.input}
        />
        <View style={styles.charCount}>
          <FontAwesome name="file-text-o" size={16} color="#7B7B7B" />
          <Text style={styles.charCountText}> {text.length}/{MAX_LENGTH}</Text>
        </View>
      </View>

      {/* Voice */}
      {!isListening ? (
        <TouchableOpacity style={styles.voiceButton} onPress={startListening}>
          <FontAwesome name="microphone" size={16} color="#fff" />
          <Text style={styles.voiceButtonText}> Use voice instead</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.stopButton} onPress={stopListening}>
          <ActivityIndicator color="#fff" style={{ marginRight: 10 }} />
          <Text style={styles.voiceButtonText}>Listening… Tap to stop</Text>
        </TouchableOpacity>
      )}

      {/* Continue */}
      <TouchableOpacity
        style={[styles.button, text.trim().length === 0 && styles.buttonDisabled]}
        onPress={handleContinue}
        disabled={text.trim().length === 0}
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
    fontSize: 22,
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
    marginTop: 30,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#7B7B7B',
    textAlign: 'center',
    marginBottom: 30,
    lineHeight: 20,
  },
  textBox: {
    borderWidth: 2,
    borderColor: '#7B7B7B',
    borderRadius: 24,
    padding: 20,
    minHeight: 150,
    justifyContent: 'space-between',
  },
  input: {
    fontSize: 18,
    fontWeight: '500',
    color: '#3e2d27',
    lineHeight: 26,
    minHeight: 100,
    textAlignVertical: 'top',
  },
  charCount: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    marginTop: 10,
  },
  charCountText: {
    color: '#7B7B7B',
    fontSize: 12,
  },
  voiceButton: {
    flexDirection: 'row',
    backgroundColor: '#A3CD75',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    elevation: 3,
  },
  stopButton: {
    flexDirection: 'row',
    backgroundColor: '#ff5e5e',
    paddingVertical: 14,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 24,
    elevation: 3,
  },
  voiceButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
  },
  button: {
    backgroundColor: '#4a3b35',
    paddingVertical: 18,
    borderRadius: 30,
    alignItems: 'center',
    marginTop: 24,
  },
  buttonDisabled: {
    opacity: 0.4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});