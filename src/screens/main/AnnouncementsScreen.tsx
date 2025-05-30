import React from 'react';
import { Box, Text, IconButton, Icon, StatusBar } from 'native-base';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { AnnouncementCard, Announcement } from 'src/components/common/AnnouncementCard';

const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    titulo: '¡Operativo de Esterilización Gratuito! 🐶🐱',
    cuerpo: '',
    imagenUrl: 'https://www.unc.edu.pe/wp-content/uploads/2023/06/campana-de-esterilizacion.jpg',
    direccionAnuncio: 'Av. Encinas 0472',
    fechaAsociada: '2025-05-10T14:00:00',
    fechaPublicacion: '2025-04-20T10:00:00',
  },
  {
    id: 2,
    titulo: 'Jornada de Adopción en Plaza Central 🐾',
    cuerpo: '',
    imagenUrl: 'https://chilemosaico.cl/eventos/wp-content/uploads/2024/07/Jornada-de-Adopcion.jpg',
    direccionAnuncio: 'Plaza 25 de Mayo',
    fechaAsociada: '2025-05-02T12:00:00',
    fechaPublicacion: '2025-04-18T09:00:00',
  },
];

export function AnnouncementsScreen() {
  const navigation = useNavigation();

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
          Noticias
        </Text>
      </Box>
      <FlatList
        data={mockAnnouncements}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <AnnouncementCard announcement={item} />}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
} 