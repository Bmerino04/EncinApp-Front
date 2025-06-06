import axios from 'axios';
import Constants from 'expo-constants';

const API_URL = Constants.manifest?.extra?.apiUrl;

export const api = axios.create({
  baseURL: API_URL,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
});