import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStackParamList } from 'src/navigation/types';
import { LandingScreen } from 'src/screens/auth/LandingScreen';
import { LoginScreen } from 'src/screens/auth/LoginScreen';

const Stack = createNativeStackNavigator<AuthStackParamList>();

interface AuthStackProps {
  onLogin: () => void;
}

export function AuthStack({ onLogin }: AuthStackProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Landing" component={LandingScreen} />
      <Stack.Screen name="Login">
        {(props) => <LoginScreen {...props} onLogin={onLogin} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}