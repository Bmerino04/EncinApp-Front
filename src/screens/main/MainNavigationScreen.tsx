import React from 'react';
import { Box, Center, VStack, HStack, Text, ScrollView } from 'native-base';
import { NavButton } from 'src/components/common/NavButton';
import { AlertButton } from 'src/components/common/AlertButton';
import { MaterialIcons, MaterialCommunityIcons, FontAwesome5 } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';

export function MainNavigationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  return (
    <Box flex={1} bg="#f5f6fa">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <Center mt={6} mb={4}>
          <Box bg="white" borderRadius={16} px={8} py={2} shadow={1}>
            <Text fontFamily="Geist" fontWeight="600" fontSize="lg" color="primary">
              Inicio
            </Text>
          </Box>
        </Center>
        <Center flex={1}>
          <VStack space={4} w="90%" maxW={400}>
            <HStack justifyContent="space-between">
              <NavButton
                icon={<MaterialIcons name="map" size={32} color="#3b4252" />}
                label="Mapa"
                onPress={() => {}}
              />
              <NavButton
                icon={<MaterialIcons name="edit" size={32} color="#3b4252" />}
                label="Crear anuncio"
                onPress={() => {}}
              />
            </HStack>
            <HStack justifyContent="space-between">
              <NavButton
                icon={<MaterialIcons name="campaign" size={32} color="#3b4252" />}
                label="Noticias"
                onPress={() => navigation.navigate('Announcements')}
              />
              <NavButton
                icon={<MaterialIcons name="groups" size={32} color="#3b4252" />}
                label="Vecinos"
                onPress={() => navigation.navigate('Users')}
              />
            </HStack>
            <HStack justifyContent="space-between">
              <NavButton
                icon={<MaterialIcons name="person" size={32} color="#3b4252" />}
                label="Información Personal"
                onPress={() => {}}
              />
              <NavButton
                icon={<MaterialCommunityIcons name="alert-box-outline" size={32} color="#3b4252" />}
                label="Registro de Alertas"
                onPress={() => {}}
              />
            </HStack>
          </VStack>
          <AlertButton onPress={() => {}} />
        </Center>
      </ScrollView>
    </Box>
  );
} 