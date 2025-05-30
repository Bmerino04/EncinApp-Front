import React from 'react';
import { Box, Text, IconButton, Icon, StatusBar, VStack, HStack, Image } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from 'src/navigation/types';

const mockAnnouncements = [
  {
    id: 1,
    titulo: '¡Operativo de Esterilización Gratuito! 🐶🐱',
    cuerpo:
      'Ven con tu mascota el 10 de Mayo del 2025 desde las 14.00 hrs hasta las 18.00 hrs a Av. Las Encinas 0472.\nAtención gratuita, incluye esterilización, desparasitación y chip.',
    imagenUrl: 'https://www.unc.edu.pe/wp-content/uploads/2023/06/campana-de-esterilizacion.jpg',
    direccionAnuncio: 'Av. Encinas 0472',
    fechaAsociada: '2025-05-10T14:00:00',
    fechaPublicacion: '2025-04-20T10:00:00',
  },
];

type AnnouncementDetailRouteProp = RouteProp<MainStackParamList, 'AnnouncementDetail'>;

export function AnnouncementDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<AnnouncementDetailRouteProp>();
  const { id } = route.params;
  const announcement = mockAnnouncements.find(a => a.id === Number(id));

  if (!announcement) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <Text>No se encontró el anuncio.</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="#f5f6fa">
      <StatusBar barStyle="dark-content" />
      <Box safeAreaTop bg="#f5f6fa" />
      <Box
        flexDirection="row"
        alignItems="center"
        bg="white"
        borderRadius={16}
        mx={3}
        mt={3}
        mb={2}
        px={2}
        py={2}
        shadow={1}
      >
        <IconButton
          icon={<Icon as={MaterialIcons} name="arrow-back-ios" size={5} color="primary" />}
          borderRadius="full"
          variant="ghost"
          onPress={() => navigation.goBack()}
        />
        <Text
          fontFamily="Geist"
          fontWeight="600"
          fontSize="lg"
          color="primary"
          flex={1}
          textAlign="center"
          mr={7}
        >
          Anuncio
        </Text>
        <IconButton
          icon={<Icon as={MaterialIcons} name="delete-outline" size={6} color="muted.500" />}
          borderRadius="full"
          variant="ghost"
          onPress={() => {}}
        />
      </Box>
      <Box bg="white" borderRadius={20} shadow={2} p={3} mx={3} mt={2}>
        <VStack space={2}>
          <Text fontFamily="Geist" fontWeight="700" fontSize="md" mb={1}>
            {announcement.titulo}
          </Text>
          <Image
            source={{ uri: announcement.imagenUrl }}
            alt={announcement.titulo}
            borderRadius={16}
            w="100%"
            h={180}
            resizeMode="cover"
            mb={2}
          />
          <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.800" mb={2}>
            {announcement.cuerpo}
          </Text>
          <HStack alignItems="center" space={1} mb={1}>
            <Icon as={MaterialIcons} name="location-on" size={4} color="muted.500" />
            <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.700">
              {announcement.direccionAnuncio}
            </Text>
          </HStack>
          <HStack alignItems="center" space={1} mb={1}>
            <Icon as={MaterialIcons} name="event" size={4} color="muted.500" />
            <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.700">
              {formatDate(announcement.fechaAsociada)}
            </Text>
          </HStack>
          <HStack alignItems="center" space={1}>
            <Icon as={MaterialIcons} name="schedule" size={4} color="muted.500" />
            <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.700">
              {formatTime(announcement.fechaAsociada)}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString();
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} hrs`;
} 