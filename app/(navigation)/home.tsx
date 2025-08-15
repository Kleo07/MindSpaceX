import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

// 📌 Tipet për MetricCard
interface MetricCardProps {
  title: string;
  value: string;
  label?: string; // opsional
  bgColor?: string; // opsional
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, label, bgColor }) => (
  <View style={[styles.metricCard, bgColor && { backgroundColor: bgColor }]}>
    <Text style={styles.metricTitle}>{title}</Text>
    <Text style={styles.metricValue}>{value}</Text>
    {label && <Text style={styles.metricLabel}>{label}</Text>}
  </View>
);

// 📌 Tipet për TrackerCard
interface TrackerCardProps {
  icon: string;
  title: string;
  value: string;
}

const TrackerCard: React.FC<TrackerCardProps> = ({ icon, title, value }) => (
  <View style={styles.trackerCard}>
    <Image source={{ uri: icon }} style={styles.metricIcons} />
    <View>
      <Text style={styles.trackerTitle}>{title}</Text>
      <Text style={styles.trackerValue}>{value}</Text>
    </View>
  </View>
);

// 📌 Tipet për ArticleCard
interface ArticleCardProps {
  text: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({ text }) => (
  <View style={styles.articleCard}>
    <Text style={styles.articleText}>{text}</Text>
  </View>
);

const Home: React.FC = () => {
  const today = new Date().toLocaleDateString("en-US", {
    weekday: "short",
    day: "numeric",
    month: "short",
    year: "numeric",
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.date}>{today}</Text>
            <Text style={styles.greeting}>Hi, Shinomiya!</Text>
          </View>
          <Image
            source={{ uri: "https://placehold.co/50x50" }}
            style={styles.avatar}
          />
        </View>

        {/* Search */}
        <View style={styles.searchContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/622/622669.png",
            }}
            style={styles.searchIcon}
          />
          <TextInput
            placeholder="Search anything..."
            placeholderTextColor="#A0A0A0"
            style={styles.searchInput}
          />
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {/* Mental Health Metrics */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mental Health Metrics</Text>
            <View style={styles.metricsContainer}>
              <MetricCard title="Froud Score" value="80" label="Healthy" />
              <MetricCard title="Mood" value="Sad" bgColor="#FF9F43" />
            </View>
          </View>

          {/* Mindful Tracker */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mindful Tracker</Text>
            <TrackerCard
              icon="https://icons.veryicon.com/png/o/miscellaneous/icon_1/time-131.png"
              title="Mindful Hours"
              value="2.5 hr"
            />
            <TrackerCard
              icon="https://cdn-icons-png.flaticon.com/512/747/747310.png"
              title="Sleep Quality"
              value="Inconsistent"
            />
            <TrackerCard
              icon="https://static.thenounproject.com/png/375269-200.png"
              title="Mindful Journal"
              value="64-Day Streak"
            />
            <TrackerCard
              icon="https://www.svgrepo.com/show/147004/brain-and-head.svg"
              title="Stress Level"
              value="Level 3 (Normal)"
            />
          </View>

          {/* Mindful Articles */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Mindful Articles</Text>
            <ArticleCard text="🧠 Will meditation help you get out from the rat race?" />
            <ArticleCard text="🧠 How mindfulness improves your daily focus" />
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

// Styles
const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: "#F6F6F6",
  },
  container: { flex: 1, padding: 20 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  date: { color: "black", fontSize: 13 },
  greeting: { fontSize: 20, color: "black", fontWeight: "bold" },
  avatar: { width: 50, height: 50, borderRadius: 25 },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#EFEFEF",
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 20,
  },
  searchIcon: {
    width: 18,
    height: 18,
    tintColor: "#A0A0A0",
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: "black",
    fontSize: 14,
    paddingVertical: 0,
  },

  section: { marginBottom: 20 },
  sectionTitle: { color: "black", fontSize: 18, fontWeight: "600", marginBottom: 10 },
  metricsContainer: { flexDirection: "row", gap: 10 },
  metricCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  metricTitle: { color: "black", fontSize: 14 },
  metricValue: { color: "black", fontSize: 22, fontWeight: "bold" },
  metricLabel: { color: "black" },
  trackerCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
    height: 90,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  trackerTitle: { fontWeight: "bold", color: "black" },
  trackerValue: { color: "black" },
  articleCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
  },
  articleText: { color: "black" },
  metricIcons: { width: 30, height: 30 },
});

export default Home;