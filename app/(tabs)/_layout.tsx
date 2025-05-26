import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NativeBaseProvider } from 'native-base';
import { theme } from '@/theme/catppuccinLatte';
import AnnouncementsScreen from './announcements';
import AnnouncementDetailScreen from './AnnouncementDetail';

const Stack = createNativeStackNavigator();

export default function AppLayout() {
  return (
    <NativeBaseProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="announcements" component={AnnouncementsScreen} />
          <Stack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </NativeBaseProvider>
  );
}
