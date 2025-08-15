import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";

const home = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.date}>Tue, 28 Jan 2025</Text>
          <Text style={styles.greeting}>Hi, Shinomiya!</Text>
        </View>
        <Image
          source={{ uri: "https://placehold.co/50x50" }}
          style={styles.avatar}
        />
      </View>

      <View style={styles.searchContainer}>
        <TextInput
          placeholder="Search anything..."
          placeholderTextColor="black"
          style={styles.searchInput}
        />
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mental Health Metrics</Text>
          <View style={styles.metricsContainer}>
            <View style={styles.metricCard}>
              <Text style={styles.metricTitle}>Froud Score</Text>
              <Text style={styles.metricValue}>80</Text>
              <Text style={styles.metricLabel}>Healthy</Text>
            </View>
            <View style={[styles.metricCard, { backgroundColor: "#FF9F43" }]}>
              <Text style={styles.metricTitle}>Mood</Text>
              <Text style={styles.metricValue}>Sad</Text>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mindful Tracker</Text>
          <View style={styles.trackerCard}>
            <Image
              source={{
                uri: "https://icons.veryicon.com/png/o/miscellaneous/icon_1/time-131.png",
              }}
              style={styles.metricIcons}
            />
            <Text>
              <Text style={{ fontWeight: "bold" }}>Mindful Hours</Text>
              {"\n"}
              <Text>2.5 hr</Text>
            </Text>
          </View>

          <View style={styles.trackerCard}>
            <Image
              source={{
                uri: "https://www.svgrepo.com/show/322863/night-sleep.svg",
              }}
              style={styles.metricIcons}
            />
            <Text>
              <Text style={{ fontWeight: "bold" }}>Sleep Quality</Text>
              {"\n"}
              <Text>Inconsistent</Text>
            </Text>
          </View>

          <View style={styles.trackerCard}>
            <Image
              source={{
                uri: "https://static.thenounproject.com/png/375269-200.png",
              }}
              style={styles.metricIcons}
            />
            <Text>
              <Text style={{ fontWeight: "bold" }}>Mindful Journal</Text>
              {"\n"}
              <Text>64-Day Streak</Text>
            </Text>
          </View>

          <View style={styles.trackerCard}>
            <Image
              source={{
                uri: "https://www.svgrepo.com/show/147004/brain-and-head.svg",
              }}
              style={styles.metricIcons}
            />
            <Text>
              <Text style={{ fontWeight: "bold" }}>Stress Level</Text>
              {"\n"}
              <Text>Level 3 (Normal)</Text>
            </Text>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mindful Articles</Text>
          <View style={styles.articleCard}>
            <Text>🧠 Will meditation help you get out from the rat race?</Text>
          </View>
          <View style={styles.articleCard}>
            <Text>🧠 Will meditation help you get out from the rat race?</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F6F6F6",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  date: {
    color: "black",
  },
  greeting: {
    fontSize: 20,
    color: "black",
    fontWeight: "bold",
    fontFamily: "Arial",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderRadius: 25,
    marginBottom: 20,
  },
  searchInput: {
    marginLeft: 10,
    color: "black",
    flex: 1,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: "black",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
  },
  metricsContainer: {
    flexDirection: "row",
    gap: 10,
  },
  metricCard: {
    flex: 1,
    backgroundColor: "white",
    padding: 15,
    borderRadius: 25,
    alignItems: "center",
  },
  metricTitle: {
    color: "black",
    fontSize: 14,
  },
  metricValue: {
    color: "black",
    fontSize: 22,
    fontWeight: "bold",
  },
  metricLabel: {
    color: "black",
  },
  trackerCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 25,
    marginBottom: 10,
    height: 100,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
    gap: 10,
  },
  therapyCard: {
    backgroundColor: "white",
    padding: 20,
    borderRadius: 12,
    alignItems: "center",
    height: 100,
  },
  articleCard: {
    backgroundColor: "white",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    height: 100,
  },
  smallText: {
    fontSize: 12,
    color: "#aaa",
  },
  metricIcons: {
    width: 30,
    height: 30,
    gap: 40,
  },
});

export default home;