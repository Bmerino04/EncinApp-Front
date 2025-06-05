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

const Stack = createNativeStackNavigator<MainStackParamList>();

export function MainStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Home" component={MainNavigationScreen} />
      <Stack.Screen name="Announcements" component={AnnouncementsScreen} />
      <Stack.Screen name="Users" component={UsersScreen} />
      <Stack.Screen name="PersonalInfo" component={PersonalInfoScreen} />
      <Stack.Screen name="AnnouncementDetail" component={AnnouncementDetailScreen} />
      <Stack.Screen name="UserDetail" component={UserDetailScreen} />
      <Stack.Screen name="UserRegister" component={UserRegisterScreen} />
      <Stack.Screen name="EditUserName" component={EditUserFieldScreen} />
      <Stack.Screen name="EditUserAddress" component={EditUserFieldScreen} />
      <Stack.Screen name="EditUserRut" component={EditUserFieldScreen} />
      <Stack.Screen name="EditUserPin" component={EditUserPinScreen} />
      {/* <Stack.Screen name="EditUser" component={EditUserScreen} /> */}
    </Stack.Navigator>
  );
} 