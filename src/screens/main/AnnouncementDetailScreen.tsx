import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Text,
  IconButton,
  Icon,
  StatusBar,
  VStack,
  HStack,
  Image,
  Spinner,
  Center,
  useToast,
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from 'src/navigation/types';
import { ConfirmDeleteModal } from 'src/components/common/ConfirmDeleteModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/api/axios';

type AnnouncementDetailRouteProp = RouteProp<MainStackParamList, 'AnnouncementDetail'>;

interface AnuncioApi {
  id_anuncio: number;
  titulo: string;
  cuerpo: string;
  multimedia_url: string | null;
  tipo_multimedia: string | null;
  fecha_relacionada: string;
  direccion: string;
  fecha_emision: string;
  id_usuario: number | null;
}

export function AnnouncementDetailScreen() {
  const navigation = useNavigation();
  const route = useRoute<AnnouncementDetailRouteProp>();
  const { id } = route.params;

  const toast = useToast();
  const [announcement, setAnnouncement] = useState<AnuncioApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [showDelete, setShowDelete] = useState(false);

  const fetchAnnouncement = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await api.get(`/anuncios/${id}`, {
        headers: {
          Authorization: token || '',
        },
      });
      setAnnouncement(response.data.anuncioEncontrado);
    } catch (error) {
      console.error('Error fetching announcement:', error);
      setAnnouncement(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const handleDelete = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token no encontrado');

      await api.delete(`/anuncios/${id}`, {
        headers: { Authorization: token },
      });

      toast.show({
        description: 'Anuncio eliminado correctamente',
        placement: 'top',
      });

      setShowDelete(false);
      navigation.goBack();
    } catch (error: any) {
      console.error('Error al eliminar anuncio:', error.response?.data || error.message);
      toast.show({
        description: 'No se pudo eliminar el anuncio',
        placement: 'top',
      });
    }
  };

  useEffect(() => {
    fetchAnnouncement();

    const unsubscribe = navigation.addListener('focus', fetchAnnouncement);
    return unsubscribe;
  }, [fetchAnnouncement, navigation]);

  if (loading) {
    return (
      <Box flex={1} bg="#f5f6fa">
        <Center flex={1}>
          <Spinner size="lg" />
        </Center>
      </Box>
    );
  }

  if (!announcement) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center" bg="#f5f6fa">
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
          onPress={() => setShowDelete(true)}
        />
      </Box>
      <Box bg="white" borderRadius={20} shadow={2} p={3} mx={3} mt={2}>
        <VStack space={2}>
          <Text fontFamily="Geist" fontWeight="700" fontSize="md" mb={1}>
            {announcement.titulo}
          </Text>
          {announcement.multimedia_url && (
            <Image
              source={{ uri: announcement.multimedia_url }}
              alt={announcement.titulo}
              borderRadius={16}
              w="100%"
              h={180}
              resizeMode="cover"
              mb={2}
            />
          )}
          <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.800" mb={2}>
            {announcement.cuerpo}
          </Text>
          <HStack alignItems="center" space={1} mb={1}>
            <Icon as={MaterialIcons} name="location-on" size={4} color="muted.500" />
            <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.700">
              {announcement.direccion}
            </Text>
          </HStack>
          <HStack alignItems="center" space={1} mb={1}>
            <Icon as={MaterialIcons} name="event" size={4} color="muted.500" />
            <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.700">
              {formatDate(announcement.fecha_relacionada)}
            </Text>
          </HStack>
          <HStack alignItems="center" space={1}>
            <Icon as={MaterialIcons} name="schedule" size={4} color="muted.500" />
            <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.700">
              {formatTime(announcement.fecha_relacionada)}
            </Text>
          </HStack>
        </VStack>
      </Box>
      <ConfirmDeleteModal
        isOpen={showDelete}
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
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