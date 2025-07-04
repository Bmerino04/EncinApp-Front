import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { MainStackParamList } from './types';
import { AnnouncementsScreen } from 'src/screens/main/AnnouncementsScreen';
import { UsersScreen } from 'src/screens/main/UsersScreen';
import { PersonalInfoScreen } from 'src/screens/main/PersonalInfoScreen';
import { AnnouncementDetailScreen } from '../screens/main/AnnouncementDetailScreen';
import { UserDetailScreen } from '../screens/main/UserDetailScreen';
import { MainNavigationScreen } from '../screens/main/MainNavigationScreen';
import { UserRegisterScreen } from '../screens/main/UserRegisterScreen';
import { EditUserFieldScreen } from '../screens/main/EditUserFieldScreen';
import { EditUserPinScreen } from '../screens/main/EditUserPinScreen';
import { CreateAnnouncementScreen } from '../screens/main/CreateAnnouncementScreen';
import { SelectAlertTypeScreen } from '../screens/main/SelectAlertTypeScreen';
import { CreateAlertScreen } from '../screens/main/CreateAlertScreen';
import { MapScreen } from '../screens/main/MapScreen';
import { AlertHistoryScreen } from '../screens/main/AlertHistoryScreen';
import { AlertDetailScreen } from '../screens/main/AlertDetailScreen';
import { CreatePOIScreen } from 'src/screens/main/CreatePOIScreen';

const Stack = createNativeStackNavigator<MainStackParamList>();

interface MainStackProps {
  onLogout: () => void;  // <-- recibe onLogout
}

export function MainStack({ onLogout }: MainStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={MainNavigationScreen} />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
      <Stack.Screen name="Users" component={UsersScreen} />
      <Stack.Screen name="PersonalInfo">
        {(props) => <PersonalInfoScreen {...props} onLogout={onLogout} />}
      </Stack.Screen>
      <Stack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} />
      <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
      <Stack.Screen name="EditUserName" component={EditUserFieldScreen} />
      <Stack.Screen name="EditUserAddress" component={EditUserFieldScreen} />
      <Stack.Screen name="EditUserRut" component={EditUserFieldScreen} />
      <Stack.Screen name="EditUserPin" component={EditUserPinScreen} />
      <Stack.Screen name="CreateAnnouncement" component={CreateAnnouncementScreen} />
      <Stack.Screen name="SelectAlertType" component={SelectAlertTypeScreen} />
      <Stack.Screen name="CreateAlert" component={CreateAlertScreen} />
      <Stack.Screen name="Map" component={MapScreen} />
      <Stack.Screen name="AlertHistory" component={AlertHistoryScreen} />
      <Stack.Screen name="AlertDetail" component={AlertDetailScreen} />
      <Stack.Screen name="CreatePOI" component={CreatePOIScreen} />
      {/* <Stack.Screen name="EditUser" component={EditUserScreen} /> */}
    </Stack.Navigator>
  );
} 