import React from 'react';
import { Box, Image, Text, ScrollView } from 'native-base';
import Header from '@/components/Header';
import AnnouncementMeta from '@/components/AnnouncementMeta';
import { useRoute, useNavigation } from '@react-navigation/native';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400?text=No+Image';

const AnnouncementDetailScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  // @ts-ignore
  const { announcement } = route.params;

  return (
    <Box flex={1} bg="background">
      <Header title="Anuncio" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text fontSize="md" fontWeight="bold" mb={2} color="text">
          {announcement.titulo}
        </Text>
        <Image
          source={{ uri: announcement.imagenUrl || PLACEHOLDER_IMAGE }}
          alt={announcement.titulo}
          borderRadius={12}
          width="100%"
          height={180}
          mb={2}
        />
        <Text color="text" fontSize="sm" mb={4}>
          {announcement.cuerpo}
        </Text>
        <AnnouncementMeta
          direccionAnuncio={announcement.direccionAnuncio}
          fechaAsociada={announcement.fechaAsociada}
        />
      </ScrollView>
    </Box>
  );
};

export default AnnouncementDetailScreen; 