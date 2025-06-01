import React from 'react';
import { Box, Button, Center, Text, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { GestureResponderEvent } from 'react-native';
import { AuthStackParamList } from 'src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Landing'>;

export function LandingScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleLogin = (e: GestureResponderEvent) => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient
      colors={['#a18cd1', '#fbc2eb']}
      style={{ flex: 1 }}
    >
      <Center flex={1} px={6}>
        <VStack space={8} alignItems="center" w="100%">
          <VStack space={2} alignItems="center">
            <Text fontFamily="Geist" fontWeight="700" fontSize="3xl" color="white">
              EncinApp
            </Text>
            <Text fontFamily="Geist" fontWeight="400" fontSize="md" color="white" textAlign="center">
              Tu red de ayuda en
              Villa Las Encinas.
            </Text>
          </VStack>
          <Button
            mt={8}
            w="100%"
            bg="primary"
            _text={{ fontFamily: 'Geist', fontWeight: '600', fontSize: 'md' }}
            borderRadius={12}
            onPress={handleLogin}
          >
            Iniciar Sesión
          </Button>
        </VStack>
      </Center>
    </LinearGradient>
  );
} 