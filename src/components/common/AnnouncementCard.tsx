import React from 'react';
import { Box, Text, Image, VStack, HStack, Icon, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export interface Announcement {
  id: number;
  titulo: string;
  cuerpo: string;
  imagenUrl: string;
  direccionAnuncio: string;
  fechaAsociada: string;
  fechaPublicacion: string;
}

interface AnnouncementCardProps {
  announcement: Announcement;
  onPress?: () => void;
}

export function AnnouncementCard({ announcement, onPress }: AnnouncementCardProps) {
  const CardContent = (
    <VStack space={2}>
      <Text fontFamily="Geist" fontWeight="700" fontSize="md" mb={1}>
        {announcement.titulo}
      </Text>

      <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.800">
        {announcement.cuerpo}
      </Text>

      {announcement.imagenUrl !== '' && (
        <Image
          source={{ uri: announcement.imagenUrl }}
          alt={announcement.titulo}
          borderRadius={16}
          w="100%"
          h={180}
          resizeMode="cover"
          mb={2}
        />
      )}

      <HStack alignItems="center" space={1} mb={1}>
        <Icon as={MaterialIcons} name="location-on" size={4} color="muted.500" />
        <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.700">
          {announcement.direccionAnuncio}
        </Text>
      </HStack>

      <HStack alignItems="center" space={1}>
        <Icon as={MaterialIcons} name="event" size={4} color="muted.500" />
        <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.700">
          {formatDateTime(announcement.fechaAsociada)}
        </Text>
      </HStack>
    </VStack>
  );

  if (onPress) {
    return (
      <Pressable onPress={onPress} borderRadius={20} mb={4} mx={1}>
        <Box bg="white" borderRadius={20} shadow={2} p={3}>
          {CardContent}
        </Box>
      </Pressable>
    );
  }

  return (
    <Box bg="white" borderRadius={20} shadow={2} p={3} mb={4} mx={1}>
      {CardContent}
    </Box>
  );
}

// Formatea fecha y hora desde `fecha_relacionada`
function formatDateTime(dateString: string) {
  const date = new Date(dateString);
  const options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  };

  return date.toLocaleDateString('es-CL', options).replace(',', ' -') + ' hrs';
} 