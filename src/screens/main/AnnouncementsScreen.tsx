import React, { useEffect, useState } from 'react';
import { Box, Text, IconButton, Icon, StatusBar, Spinner } from 'native-base';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { AnnouncementCard, Announcement } from 'src/components/common/AnnouncementCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/api/axios';

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

export function AnnouncementsScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [anuncios, setAnuncios] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('No token found');
          setLoading(false);
          return;
        }
        const response = await api.get('/anuncios', {
          headers: { Authorization: token },
        });

        const anunciosConvertidos: Announcement[] = response.data.anunciosEncontrados.map((anuncio: AnuncioApi) => ({
          id: anuncio.id_anuncio,
          titulo: anuncio.titulo,
          cuerpo: anuncio.cuerpo,
          imagenUrl: anuncio.multimedia_url || '', // Puedes mostrar un placeholder si no hay imagen
          direccionAnuncio: anuncio.direccion,
          fechaAsociada: anuncio.fecha_relacionada,
          fechaPublicacion: anuncio.fecha_emision,
        }));

        setAnuncios(anunciosConvertidos);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnuncios();

    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true);
      fetchAnuncios();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" />
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
          Noticias
        </Text>
      </Box>
      <FlatList
        data={anuncios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AnnouncementCard
            announcement={item}
            onPress={() => navigation.navigate('AnnouncementDetail', { id: String(item.id) })}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
}