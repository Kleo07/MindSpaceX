import React, { useState, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  FlatList,
  TextInput,
} from "react-native";
import Video from "react-native-video";
import { WebView } from "react-native-webview";
import { JSX } from "react/jsx-runtime";

interface LearnItem {
  id: string;
  title: string;
  image: string;
}

interface VideoItem {
  id: string;
  title: string;
  author: string;
  rating: number;
  views: string;
  comments: number;
  videoUrl: string;
  thumbnail: string;
}

interface VideoState {
  playing: boolean;
  paused: boolean;
}

interface ArticleItem {
  id: string;
  title: string;
  category: string;
  tag: string;
  author: string;
  rating: number;
  views: string;
  comments: number;
  image: string;
  content: string;
}

const DATA: LearnItem[] = [
  { id: "1", title: "Mindfulness & Meditation", image: "https://img.icons8.com/?size=100&id=3fIgf5dq3ssf&format=png&color=000000" },
  { id: "2", title: "Articles & Learning", image: "https://img.icons8.com/?size=100&id=CZyRRfKS0tj5&format=png&color=000000" },
  { id: "3", title: "Mental Fitness", image: "https://img.icons8.com/?size=100&id=gGEbibWhI11X&format=png&color=000000" },
  { id: "4", title: "Stress & Anxiety Relief", image: "https://img.icons8.com/?size=100&id=KiB3ktsUT3sV&format=png&color=000000" },
  { id: "5", title: "Personal Growth", image: "https://img.icons8.com/?size=100&id=s4TzAIeDIJTp&format=png&color=000000" },
  { id: "6", title: "Sleep & Relaxation", image: "https://img.icons8.com/?size=100&id=cWXYWoRzod5B&format=png&color=000000" },
  { id: "7", title: "Yoga & Movement", image: "https://img.icons8.com/?size=100&id=6CFfkAl9ccpA&format=png&color=000000" },
];

const meditationVideos: VideoItem[] = [
  {
    id: "1",
    title: "Mindfulness 101",
    author: "Dr. Hannibal Lector",
    rating: 4.5,
    views: "200K",
    comments: 23,
    videoUrl: "https://www.youtube.com/watch?v=ZToicYcHIOU",
    thumbnail: "https://img.youtube.com/vi/ZToicYcHIOU/hqdefault.jpg",
  },
  {
    id: "2",
    title: "Indian Meditation",
    author: "Alan Watts",
    rating: 3.5,
    views: "185K",
    comments: 44,
    videoUrl: "https://www.w3schools.com/html/movie.mp4",
    thumbnail: "https://via.placeholder.com/80",
  },
];

const articles: ArticleItem[] = [
  {
    id: "1",
    title: "What is anxiety and how to manage it?",
    category: "Anxiety",
    tag: "Mental Health",
    author: "Altin Syla",
    rating: 4.5,
    views: "200K",
    comments: 23,
    image: "https://www.mindwellcare.com/mt-content/uploads/2023/08/6425304.webp",
    content: "Anxiety is a common emotion characterized by feelings of worry..."
  },
  {
    id: "2",
    title: "Yoga and its benefits",
    category: "Tips & Tricks",
    tag: "Mental Health",
    author: "Altin Syla",
    rating: 4.8,
    views: "150K",
    comments: 30,
    image: "https://media.npr.org/assets/img/2012/02/06/istock_000016611276small-6752354d634e040546880e4f50cb4af3c59626e5.jpg",
    content: "Yoga offers a wide range of benefits for both physical and mental well-being..."
  },
];

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F6F6F6" },
  subCard: { backgroundColor: "#7d944d", padding: 16, borderBottomLeftRadius: 40, borderBottomRightRadius: 40, marginBottom: 20 },
  header: { fontSize: 30, color: "white", paddingTop: 30 },
  sloganText: { fontSize: 20, color: "white" },
  searchBar: { height: 50, borderColor: "#ccc", borderWidth: 1, borderRadius: 25, paddingHorizontal: 20, marginTop: 20, backgroundColor: "#fff", fontSize: 20 },
  horizontalList: { paddingLeft: 20, paddingBottom: 20 },
  card: { backgroundColor: "#FFF", width: 150, marginRight: 15, padding: 15, borderRadius: 25, alignItems: "center" },
  cardSelected: { borderColor: "#4A90E2", borderWidth: 2 },
  icon: { width: 64, height: 64, marginBottom: 10 },
  title: { fontSize: 18, color: "#333", textAlign: "center" },
  contentContainer: { marginTop: 20, paddingHorizontal: 20, paddingBottom: 40 },
  placeholder: { textAlign: "center", fontSize: 18, color: "#888" },
  sectionTitle: { fontSize: 20, fontWeight: "bold", marginBottom: 10, color: "#444" },
  videoCard: { backgroundColor: "#fff", padding: 12, marginBottom: 15, borderRadius: 20, flexDirection: "row", alignItems: "center" },
  videoThumbnail: { width: 80, height: 80, borderRadius: 10, marginRight: 15 },
  videoInfo: { flex: 1 },
  videoTitle: { fontSize: 18, fontWeight: "bold", color: "#333" },
  videoMeta: { fontSize: 18, color: "#666", marginTop: 4 },
  controlButton: { padding: 5, marginTop: 5 },
  fullScreenVideo: { width: "100%", height: 200, backgroundColor: "#000", marginBottom: 10 },
  closeButton: { position: "absolute", top: 10, right: 10, padding: 5, backgroundColor: "#fff", borderRadius: 15 },
  articleCard: { backgroundColor: "#fff", borderRadius: 15, overflow: "hidden", marginBottom: 15 },
  articleImage: { width: "100%", height: 150 },
  articleDetail: { padding: 15 },
});

const Learn = () => {
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [videoStates, setVideoStates] = useState<{ [key: string]: VideoState }>(
    meditationVideos.reduce((acc, video) => ({ ...acc, [video.id]: { playing: false, paused: false } }), {})
  );
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<ArticleItem | null>(null);
  const videoRef = useRef<any>(null);

  const filteredData = DATA.filter((item: LearnItem) => item.title.toLowerCase().includes(search.toLowerCase()));

  const renderItem = ({ item }: { item: LearnItem }) => (
    <TouchableOpacity
      style={[styles.card, item.title === selectedCategory && styles.cardSelected]}
      onPress={() => setSelectedCategory(item.title)}
    >
      <Image source={{ uri: item.image }} style={styles.icon} />
      <Text style={styles.title}>{item.title}</Text>
    </TouchableOpacity>
  );

  const renderVideo = (video: VideoItem) => (
    <View key={video.id} style={styles.videoCard}>
      <Image source={{ uri: video.thumbnail }} style={styles.videoThumbnail} />
      <View style={styles.videoInfo}>
        <Text style={styles.videoTitle}>{video.title}</Text>
        <Text style={styles.videoMeta}>By {video.author}</Text>
        <Text style={styles.videoMeta}>⭐ {video.rating} · 👁 {video.views} · 💬 {video.comments}</Text>
        <TouchableOpacity
          style={styles.controlButton}
          onPress={() => {
            setSelectedVideo(video);
            setVideoStates((prev) => ({
              ...prev,
              [video.id]: { ...prev[video.id], playing: true, paused: false },
            }));
          }}
        >
          <Text>Play</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  const contentMap: { [key: string]: JSX.Element } = {
    "Mindfulness & Meditation": (
      <View>
        <Text style={styles.sectionTitle}>Meditation Videos</Text>
        {selectedVideo && (
          <View style={{ zIndex: 1 }}>
            {selectedVideo.videoUrl.includes("youtube.com") ? (
              <WebView
                style={{ height: 200, width: "100%", backgroundColor: "#000" }}
                javaScriptEnabled={true}
                domStorageEnabled={true}
                source={{
                  uri: selectedVideo.videoUrl.replace("watch?v=", "embed/") + "?autoplay=1&mute=1",
                }}
              />
            ) : (
              <TouchableOpacity
                onPress={() => {
                  setVideoStates((prev) => ({
                    ...prev,
                    [selectedVideo.id]: { ...prev[selectedVideo.id], paused: !prev[selectedVideo.id]?.paused },
                  }));
                }}
              >
                <Video
                  ref={videoRef}
                  source={{ uri: selectedVideo.videoUrl }}
                  paused={!videoStates[selectedVideo.id]?.playing || videoStates[selectedVideo.id]?.paused}
                  style={styles.fullScreenVideo}
                  resizeMode="contain"
                  onEnd={() => {
                    setSelectedVideo(null);
                    setVideoStates((prev) => ({
                      ...prev,
                      [selectedVideo.id]: { ...prev[selectedVideo.id], playing: false },
                    }));
                  }}
                  onError={(e) => console.log("Video Error:", e)}
                />
              </TouchableOpacity>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => {
                setSelectedVideo(null);
                setVideoStates((prev) => ({
                  ...prev,
                  [selectedVideo.id]: { ...prev[selectedVideo.id], playing: false, paused: false },
                }));
              }}
            >
              <Text>Close</Text>
            </TouchableOpacity>
          </View>
        )}
        <View style={{ marginTop: selectedVideo ? styles.fullScreenVideo.height : 0 }}>
          {meditationVideos.map(renderVideo)}
        </View>
      </View>
    ),
    "Articles & Learning": (
      <View>
        {!selectedArticle ? (
          <>
            <Text style={styles.sectionTitle}>All Articles</Text>
            {articles.map((article) => (
              <TouchableOpacity
                key={article.id}
                style={styles.articleCard}
                onPress={() => setSelectedArticle(article)}
              >
                <Image source={{ uri: article.image }} style={styles.articleImage} />
                <View style={{ padding: 10 }}>
                  <Text>{article.tag}</Text>
                  <Text>{article.title}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </>
        ) : (
          <ScrollView style={styles.articleDetail}>
            <TouchableOpacity onPress={() => setSelectedArticle(null)}>
              <Text>← Back</Text>
              <Text>{selectedArticle.title}</Text>
              <Text>{selectedArticle.category}</Text>
              <Text>⭐ {selectedArticle.rating} · 👁 {selectedArticle.views} · 💬 {selectedArticle.comments}</Text>
              <Text>By {selectedArticle.author}</Text>
              <Image source={{ uri: selectedArticle.image }} style={{ width: "100%", height: 200 }} />
              <Text>{selectedArticle.content}</Text>
            </TouchableOpacity>
          </ScrollView>
        )}
      </View>
    ),
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.subCard}>
        <Text style={styles.header}>Educational Resources</Text>
        <Text style={styles.sloganText}>Discover resources to improve your mind, body, and spirit — all in one place.</Text>
        <TextInput placeholder="Search..." value={search} onChangeText={setSearch} style={styles.searchBar} />
      </View>
      <FlatList data={filteredData} renderItem={renderItem} keyExtractor={(item) => item.id} horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.horizontalList} />
      <View style={styles.contentContainer}>
        {selectedCategory ? contentMap[selectedCategory] ?? <Text style={styles.placeholder}>No content available for this category.</Text> : <Text style={styles.placeholder}>Tap a category to view content</Text>}
      </View>
    </ScrollView>
  );
};

export default Learn;