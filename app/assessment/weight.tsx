import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';
import { router } from 'expo-router';
import { useApi } from '../../utils/api';

const ITEM_WIDTH = 40;

export default function WeightScreen() {
  const [unit, setUnit] = useState<'kg' | 'lbs'>('kg');
  const [selectedWeight, setSelectedWeight] = useState<number>(70); // default display
  const flatListRef = useRef<FlatList<number>>(null);
  const { saveAssessmentStep } = useApi();

  // ranges
  const weightRange =
    unit === 'kg'
      ? Array.from({ length: 201 }, (_, i) => i + 30) // 30–230 kg
      : Array.from({ length: 401 }, (_, i) => i + 66); // 66–466 lbs

  const initialIndex = unit === 'kg' ? selectedWeight - 30 : selectedWeight - 66;

  const getItemLayout = (_: any, index: number) => ({
    length: ITEM_WIDTH,
    offset: ITEM_WIDTH * index,
    index,
  });

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const idx = Math.round(e.nativeEvent.contentOffset.x / ITEM_WIDTH);
    if (idx >= 0 && idx < weightRange.length) {
      setSelectedWeight(weightRange[idx]);
    }
  };

  const switchUnit = (next: 'kg' | 'lbs') => {
    if (next === unit) return;
    let converted = selectedWeight;
    if (next === 'lbs' && unit === 'kg') {
      converted = Math.round(selectedWeight * 2.20462);
    } else if (next === 'kg' && unit === 'lbs') {
      converted = Math.round(selectedWeight / 2.20462);
    }
    setUnit(next);
    // snap list to converted position
    const range = next === 'kg'
      ? Array.from({ length: 201 }, (_, i) => i + 30)
      : Array.from({ length: 401 }, (_, i) => i + 66);
    const targetIndex = Math.max(0, range.findIndex((v) => v === converted));
    setSelectedWeight(range[targetIndex] ?? range[0]);
    requestAnimationFrame(() => {
      flatListRef.current?.scrollToIndex({ index: targetIndex, animated: true });
    });
  };

  const handleContinue = async () => {
    // persist BOTH fields before moving on
    await saveAssessmentStep('weight', selectedWeight);
    await saveAssessmentStep('weightUnit', unit);
    router.push('/assessment/mood');
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
          <Text style={styles.progressText}>4 of 14</Text>
        </View>
      </View>

      <Text style={styles.title}>What's your weight?</Text>

      {/* Unit Switch */}
      <View style={styles.unitSwitch}>
        <TouchableOpacity
          onPress={() => switchUnit('kg')}
          style={[styles.unitBtn, unit === 'kg' && styles.unitBtnActive]}
        >
          <Text style={[styles.unitText, unit === 'kg' && styles.unitTextActive]}>kg</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => switchUnit('lbs')}
          style={[styles.unitBtn, unit === 'lbs' && styles.unitBtnActive]}
        >
          <Text style={[styles.unitText, unit === 'lbs' && styles.unitTextActive]}>lbs</Text>
        </TouchableOpacity>
      </View>

      {/* Current Weight */}
      <Text style={styles.weightDisplay}>
        {selectedWeight} <Text style={styles.unitDisplay}>{unit}</Text>
      </Text>

      {/* Ruler */}
      <FlatList
        ref={flatListRef}
        data={weightRange}
        keyExtractor={(item) => String(item)}
        horizontal
        showsHorizontalScrollIndicator={false}
        snapToInterval={ITEM_WIDTH}
        decelerationRate="fast"
        getItemLayout={getItemLayout}
        initialScrollIndex={Math.max(0, initialIndex)}
        onScroll={onScroll}
        scrollEventThrottle={16}
        contentContainerStyle={{
          paddingHorizontal: Dimensions.get('window').width / 2 - ITEM_WIDTH / 2,
        }}
        renderItem={({ item }) => (
          <View style={styles.tickMarkContainer}>
            <Text style={styles.tickLabel}>{item}</Text>
          </View>
        )}
      />

      {/* Selector */}
      <View pointerEvents="none" style={styles.selectorWrapper}>
        <View style={styles.tickGroup}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={`left-${i}`} style={styles.tick} />
          ))}
        </View>
        <View style={styles.selectorOuter}>
          <View style={styles.selectorInner} />
        </View>
        <View style={styles.tickGroup}>
          {Array.from({ length: 6 }).map((_, i) => (
            <View key={`right-${i}`} style={styles.tick} />
          ))}
        </View>
      </View>

      {/* Continue */}
      <TouchableOpacity style={styles.button} onPress={handleContinue}>
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fefaf7', paddingHorizontal: 20, paddingTop: 60, paddingBottom: 30 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backIcon: { fontSize: 22, color: '#3e3e3e' },
  headerText: { fontSize: 18, fontWeight: '600', color: '#3e3e3e' },
  progressBadge: { backgroundColor: '#f3e5db', paddingVertical: 4, paddingHorizontal: 10, borderRadius: 15 },
  progressText: { fontSize: 12, color: '#5b4234' },
  title: { fontSize: 24, fontWeight: '700', color: '#3e2d27', textAlign: 'center', marginTop: 30, marginBottom: 20 },
  unitSwitch: { flexDirection: 'row', alignSelf: 'center', marginBottom: 30, borderRadius: 50, backgroundColor: '#f5f1ed', overflow: 'hidden' },
  unitBtn: { paddingVertical: 12, paddingHorizontal: 30 },
  unitBtnActive: { backgroundColor: '#f4831f', borderRadius: 30 },
  unitText: { fontSize: 16, fontWeight: '500', color: '#3e3e3e' },
  unitTextActive: { color: '#fff', fontWeight: '700' },
  weightDisplay: { fontSize: 64, fontWeight: '800', color: '#3e2d27', textAlign: 'center', marginBottom: 20 },
  unitDisplay: { fontSize: 24, fontWeight: '400', color: '#6c6460' },
  tickMarkContainer: { width: ITEM_WIDTH, alignItems: 'center' },
  tickLabel: { fontSize: 16, color: '#1f1304ff' },
  selectorWrapper: {
    position: 'absolute',
    top: Dimensions.get('window').height / 2 - 30,
    left: Dimensions.get('window').width / 2 - 80,
    width: 160,
    height: 60,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  tickGroup: { gap: 4, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  tick: { width: 2, height: 14, backgroundColor: '#000', borderRadius: 1 },
  selectorOuter: { width: 16, height: 60, borderRadius: 12, backgroundColor: '#dfe7db', justifyContent: 'center', alignItems: 'center', marginHorizontal: 8 },
  selectorInner: { width: 8, height: 50, borderRadius: 4, backgroundColor: '#8bc34a' },
  button: { backgroundColor: '#4a3b35', paddingVertical: 18, alignItems: 'center', borderRadius: 30, marginTop: 40, marginBottom: 90 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});