import React from 'react';
import { Pressable } from 'native-base';
import { Box, Image, Text, VStack } from 'native-base';
import AnnouncementMeta from './AnnouncementMeta';

const PLACEHOLDER_IMAGE = 'https://placehold.co/600x400?text=No+Image';

export interface AnnouncementCardProps {
  titulo: string;
  imagenUrl?: string;
  direccionAnuncio: string;
  fechaAsociada: string;
  onPress?: () => void;
}

const AnnouncementCard: React.FC<AnnouncementCardProps> = ({
  titulo,
  imagenUrl,
  direccionAnuncio,
  fechaAsociada,
  onPress,
}) => {
  return (
    <Pressable onPress={onPress} _pressed={{ opacity: 0.9 }}>
      <Box
        bg="card"
        borderRadius={16}
        shadow={2}
        p={3}
        mb={4}
      >
        <Text fontSize="md" fontWeight="bold" mb={2} color="text">
          {titulo}
        </Text>
        <Image
          source={{ uri: imagenUrl || PLACEHOLDER_IMAGE }}
          alt={titulo}
          borderRadius={12}
          width="100%"
          height={180}
          mb={2}
        />
        <AnnouncementMeta
          direccionAnuncio={direccionAnuncio}
          fechaAsociada={fechaAsociada}
        />
      </Box>
    </Pressable>
  );
};

export default AnnouncementCard; 