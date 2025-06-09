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
      {/* <Stack.Screen name="EditUser" component={EditUserScreen} /> */}
    </Stack.Navigator>
  );
}