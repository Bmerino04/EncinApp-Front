import 'dotenv/config';

export default {
  expo: {
    name: 'TuApp',
    slug: 'tuapp',
    version: '1.0.0',
    extra: {
      apiUrl: process.env.API_URL || 'http://192.168.1.20:3000/api',
    },
  },
};