import { Platform } from 'react-native';

export const API_BASE_URL =
  Platform.OS === 'android'
    ? 'http://10.0.2.2:5000' // Android emulator
    : 'http://127.0.0.1:5000'; // iOS Simulator (ose localhost)