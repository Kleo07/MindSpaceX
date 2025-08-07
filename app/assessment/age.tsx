import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Dimensions,
  TouchableOpacity,
} from 'react-native';
import React, { useState, useRef } from 'react';
import { router } from 'expo-router';

const AgeScreen = () => {
  const [selectedAge, setSelectedAge] = useState<number>(18);
  const ageRange = Array.from({ length: 100 }, (_, i) => i + 10); // 10 to 109
  const ITEM_HEIGHT = 60;
  const flatListRef = useRef<FlatList>(null);

  return (
    <View style={styles.container}>
      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>⬅️</Text>
        </TouchableOpacity>
        <Text style={styles.headerText}>Assessment</Text>
        <View style={styles.progressBadge}>
          <Text style={styles.progressText}>3 of 14</Text>
        </View>
      </View>

      {/* Title */}
      <Text style={styles.title}>What's your age?</Text>

      {/* Age Picker */}
      <FlatList
        ref={flatListRef}
        data={ageRange}
        keyExtractor={(item) => item.toString()}
        showsVerticalScrollIndicator={false}
        getItemLayout={(_, index) => ({
          length: ITEM_HEIGHT,
          offset: ITEM_HEIGHT * index,
          index,
        })}
        initialScrollIndex={selectedAge - 10}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        bounces={false}
        onScroll={(event) => {
          const index = Math.round(
            event.nativeEvent.contentOffset.y / ITEM_HEIGHT
          );
          setSelectedAge(ageRange[index]);
        }}
        style={{ flexGrow: 0 }}
        contentContainerStyle={{
          paddingTop:
            Dimensions.get('window').height / 2 - ITEM_HEIGHT * 2.5,
          paddingBottom:
            Dimensions.get('window').height / 2 - ITEM_HEIGHT * 2.5,
        }}
        renderItem={({ item }) => {
          const isSelected = item === selectedAge;
          return (
            <View style={[styles.item, isSelected && styles.selectedItem]}>
              <Text
                style={[styles.itemText, isSelected && styles.selectedText]}
              >
                {item}
              </Text>
            </View>
          );
        }}
      />

      {/* Continue Button */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          console.log('Selected age:', selectedAge);
          router.push('/assessment/weight');
        }}
      >
        <Text style={styles.buttonText}>Continue →</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AgeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fefaf7',
    paddingTop: 60,
    paddingBottom: 30,
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '90%',
    marginBottom: 20,
  },
  backText: {
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
    fontSize: 24,
    fontWeight: '700',
    color: '#3e2d27',
    textAlign: 'center',
    marginBottom: 30,
  },
  item: {
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedItem: {
    backgroundColor: '#a1c66b',
    borderRadius: 50,
    marginVertical: 8,
    paddingHorizontal: 30,
  },
  itemText: {
    fontSize: 24,
    color: '#aaa',
  },
  selectedText: {
    color: '#fff',
    fontSize: 40,
    fontWeight: '700',
  },
  button: {
    backgroundColor: '#4a3b35',
    paddingVertical: 18,
    paddingHorizontal: 30,
    borderRadius: 30,
    marginTop: 40,
    marginBottom: 90,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});