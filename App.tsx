import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import { theme } from './theme/catppuccinLatte';
import HomeScreen from './screens/HomeScreen';
import AnnouncementsScreen from './screens/AnnouncementsScreen';
import AnnouncementDetailScreen from './screens/AnnouncementDetailScreen';
import { RootStackParamList } from './navigation/types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }} initialRouteName="Home">
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="announcements" component={AnnouncementsScreen} />
          <Stack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
} 