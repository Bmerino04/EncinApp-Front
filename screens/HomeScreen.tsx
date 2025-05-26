import React from 'react';
import { Box, Button, Text } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const HomeScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Box flex={1} alignItems="center" justifyContent="center" bg="background">
      <Text fontSize="xl" mb={4}>Bienvenido a EncinApp</Text>
      <Button onPress={() => navigation.navigate('announcements')}>
        Ver anuncios
      </Button>
    </Box>
  );
};

export default HomeScreen;