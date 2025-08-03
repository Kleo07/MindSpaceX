import 'dotenv/config';

export default {
  expo: {
    name: 'msx',
    slug: 'msx',
    scheme: 'msx',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/icon.png',
    userInterfaceStyle: 'automatic',
    newArchEnabled: true,
    ios: {
      supportsTablet: true,
      bundleIdentifier: 'com.anonymous.msx', // Ky do të përdoret vetëm nëse nuk ke folder ios
      infoPlist: {
        NSMicrophoneUsageDescription: 'This app needs access to your microphone to record your voice.',
        NSSpeechRecognitionUsageDescription: 'This app uses speech recognition to convert your voice to text.',
        NSPhotoLibraryUsageDescription: 'This app requires access to your photo library to upload profile photos.',
      },
    },
    android: {
      package: 'com.anonymous.msx',
      adaptiveIcon: {
        foregroundImage: './assets/images/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      favicon: './assets/images/favicon.png',
    },
    plugins: ['expo-router', 'expo-secure-store'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      clerkPublishableKey: process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY,
      eas: {
        projectId: '19162b7d-c641-4156-b2a4-06020d2d7158', // Vendos ID-në që të dha EAS
      },
    },
  },
};