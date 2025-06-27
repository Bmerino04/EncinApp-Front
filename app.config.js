import 'dotenv/config';

export default {
  expo: {
    name: 'EncinApp',
    slug: 'encinapp',
    version: '1.0.0',
    extra: {
      apiUrl: process.env.API_URL || 'http://192.168.1.20:3000/api',
    },
    android: {
      package: 'com.encinapp.dev',
    },
    ios: {
      bundleIdentifier: 'com.encinapp.dev',
    },
  },
};