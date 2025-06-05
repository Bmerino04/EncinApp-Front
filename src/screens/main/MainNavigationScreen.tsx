import React from 'react';
import { Box, Center, Text, Pressable, VStack, HStack, View } from 'native-base';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';

const NAV_BUTTONS = [
  {
    icon: <MaterialIcons name="map" size={36} color="#45475a" />, label: 'Mapa', onPress: () => {},
  },
  {
    icon: <MaterialIcons name="edit" size={36} color="#45475a" />, label: 'Crear anuncio', onPress: (nav: any) => nav.navigate('CreateAnnouncement'),
  },
  {
    icon: <MaterialIcons name="campaign" size={36} color="#45475a" />, label: 'Noticias', onPress: (nav: any) => nav.navigate('Announcements'),
  },
  {
    icon: <MaterialIcons name="groups" size={36} color="#45475a" />, label: 'Vecinos', onPress: (nav: any) => nav.navigate('Users'),
  },
  {
    icon: <MaterialIcons name="person" size={36} color="#45475a" />, label: 'Información Personal', onPress: (nav: any) => nav.navigate('PersonalInfo'),
  },
  {
    icon: <MaterialCommunityIcons name="alert-box-outline" size={36} color="#45475a" />, label: 'Registro de Alertas', onPress: () => {},
  },
];

export function MainNavigationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <Box flex={1} bg="#f5f6fa">
      <Center mt={6} mb={4}>
        <Box bg="white" borderRadius={16} px={8} py={2} shadow={1}>
          <Text fontFamily="Geist" fontWeight="600" fontSize="lg" color="primary">
            Inicio
          </Text>
        </Box>
      </Center>
      <View flex={1} alignItems="center" justifyContent="flex-start">
        <View w="90%" maxW={400}>
          <HStack flexWrap="wrap" justifyContent="space-between">
            {NAV_BUTTONS.map((btn, idx) => (
              <Pressable
                key={btn.label}
                onPress={() => btn.onPress(navigation)}
                w="48%"
                mb={4}
                alignItems="center"
                justifyContent="center"
              >
                <Box
                  w={"100%"}
                  h={24}
                  borderRadius={16}
                  borderWidth={2}
                  borderColor="#4f8cff"
                  alignItems="center"
                  justifyContent="center"
                  bg="white"
                  shadow={1}
                >
                  <VStack alignItems="center" space={2}>
                    {btn.icon}
                    <Text fontFamily="Geist" fontWeight="500" fontSize="md" color="#4f8cff" textAlign="center">
                      {btn.label}
                    </Text>
                  </VStack>
                </Box>
              </Pressable>
            ))}
          </HStack>
        </View>
        <Center mt={10} mb={4}>
          <Pressable onPress={() => {}} alignSelf="center">
            <Box
              borderRadius={999}
              borderWidth={8}
              borderColor="#FF6A00"
              bg="white"
              w={56}
              h={56}
              alignItems="center"
              justifyContent="center"
              shadow={4}
            >
              <MaterialCommunityIcons name="alert-outline" size={64} color="#FF2D55" />
              <Text
                fontFamily="Geist"
                fontWeight="700"
                fontSize="2xl"
                color="#FF2D55"
                textAlign="center"
                lineHeight={32}
                mt={2}
              >
                Emitir{"\n"}Alerta
              </Text>
            </Box>
          </Pressable>
        </Center>
      </View>
    </Box>
  );
} 