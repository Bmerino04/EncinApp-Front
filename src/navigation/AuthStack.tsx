import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from 'src/navigation/types';
import { LandingScreen } from 'src/screens/auth/LandingScreen';
import { LoginScreen } from 'src/screens/auth/LoginScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

export function AuthStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
    </Stack.Navigator>
  );
} 