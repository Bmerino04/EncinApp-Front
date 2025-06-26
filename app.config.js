import 'dotenv/config';

export default {
  expo: {
    name: 'EncinApp',
    slug: 'encinapp',
    version: '1.0.0',
    extra: {
      apiUrl: process.env.API_URL || 'http://192.168.127.111:3000/api',
      eas: {
        projectId: 'b35caac4-09ee-4779-ba1e-a3a8f66f2f58',
      },
    },
    android: {
      package: 'com.encinapp.dev',
      googleServicesFile: './android/google-services.json',
    },
    ios: {
      bundleIdentifier: 'com.encinapp.dev',
    },
  },
};