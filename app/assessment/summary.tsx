import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  Easing,
} from 'react-native';
import { router } from 'expo-router';

export default function FinalPage() {
  const firework1 = useRef(new Animated.Value(0)).current;
  const firework2 = useRef(new Animated.Value(0)).current;
  const firework3 = useRef(new Animated.Value(0)).current;

  const triggerFireworks = () => {
    const animate = (anim: Animated.Value, delay: number) => {
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration: 400,
          delay,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    };

    animate(firework1, 0);
    animate(firework2, 200);
    animate(firework3, 400);
  };

  useEffect(() => {
    triggerFireworks();
  }, []);

  const fireworkStyle = (anim: Animated.Value, x: number, y: number) => ({
    position: 'absolute' as const,
    left: x,
    top: y,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#F6A945',
    transform: [
      { scale: anim },
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -50],
        }),
      },
    ],
    opacity: anim,
  });

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.circleIcon}>◐</Text>
        <Text style={styles.headerText}>Assessment</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>15 of 15</Text>
        </View>
      </View>

      <Text style={styles.title}>You're All Done 🎉</Text>
      <Text style={styles.subtitle}>
        “You are not a drop in the ocean. You are the entire ocean in a drop.” — Rumi
      </Text>

      {/* Fireworks */}
      <View style={styles.fireworkArea}>
        <Animated.View style={fireworkStyle(firework1, 100, 20)} />
        <Animated.View style={fireworkStyle(firework2, 180, 60)} />
        <Animated.View style={fireworkStyle(firework3, 250, 30)} />
      </View>

      {/* Done Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/assessment/dashboard')}
      >
        <Text style={styles.buttonText}>Dashboard</Text>
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
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  circleIcon: {
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
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: '#3e2d27',
    marginTop: 40,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontStyle: 'italic',
    textAlign: 'center',
    color: '#7B7B7B',
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  fireworkArea: {
    marginTop: 40,
    height: 100,
    position: 'relative',
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