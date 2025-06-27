import axios from 'axios';
import Constants from 'expo-constants';

const API_URL =
  Constants.manifest?.extra?.apiUrl || // modo desarrollo
  Constants.expoConfig?.extra?.apiUrl || // modo producción
  'http://192.168.58.111:3000/api'; // fallback
  

export const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});