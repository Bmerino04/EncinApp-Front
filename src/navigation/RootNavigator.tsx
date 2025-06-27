import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { RootStackParamList } from './types';
import { AuthStack } from './AuthStack';
import { MainStack } from './MainStack';

const Stack = createNativeStackNavigator<RootStackParamList>();

interface RootNavigatorProps {
  isAuthenticated: boolean;
  onLogin: () => void;
  onLogout: () => void;
}

export function RootNavigator({ isAuthenticated, onLogin, onLogout }: RootNavigatorProps) {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      {!isAuthenticated ? (
        <Stack.Screen name="Auth">
          {(props) => <AuthStack {...props} onLogin={onLogin} />}
        </Stack.Screen>
      ) : (
        <Stack.Screen name="Main">
          {(props) => <MainStack {...props} onLogout={onLogout} />}
        </Stack.Screen>
      )}
    </Stack.Navigator>
  );
}