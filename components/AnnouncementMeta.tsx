import React from 'react';
import { HStack, Icon, Text, VStack } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

interface AnnouncementMetaProps {
  direccionAnuncio: string;
  fechaAsociada: string; // ISO string
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString('es-MX', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const AnnouncementMeta: React.FC<AnnouncementMetaProps> = ({ direccionAnuncio, fechaAsociada }) => (
  <VStack space={1} mt={2}>
    <HStack alignItems="center" space={1}>
      <Icon as={MaterialIcons} name="location-on" size={4} color="muted" />
      <Text color="muted" fontSize="sm">{direccionAnuncio}</Text>
    </HStack>
    <HStack alignItems="center" space={1}>
      <Icon as={MaterialIcons} name="event" size={4} color="muted" />
      <Text color="muted" fontSize="sm">{formatDate(fechaAsociada)}</Text>
    </HStack>
    <HStack alignItems="center" space={1}>
      <Icon as={MaterialIcons} name="schedule" size={4} color="muted" />
      <Text color="muted" fontSize="sm">{formatTime(fechaAsociada)}</Text>
    </HStack>
  </VStack>
);

export default AnnouncementMeta; 