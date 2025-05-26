import React, { useEffect, useState } from 'react';
import { FlatList } from 'react-native';
import { Box, Spinner, Text } from 'native-base';
import AnnouncementCard from '@/components/AnnouncementCard';
import Header from '@/components/Header';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

const AnnouncementsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    axios.get('http://localhost:3000/anuncios')
      .then(response => {
        setAnnouncements(response.data);
        setLoading(false);
      })
      .catch(err => {
        setError('No se pudieron cargar los anuncios');
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center" bg="background">
        <Spinner size="lg" />
      </Box>
    );
  }

  if (error) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center" bg="background">
        <Text color="red.500">{error}</Text>
      </Box>
    );
  }

  return (
    <Box flex={1} bg="background">
      <Header title="Noticias" />
      <FlatList
        data={announcements}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => (
          <AnnouncementCard
            titulo={item.titulo}
            imagenUrl={item.imagenUrl}
            direccionAnuncio={item.direccionAnuncio}
            fechaAsociada={item.fechaAsociada}
            onPress={() => navigation.navigate('AnnouncementDetail', { announcement: item })}
          />
        )}
        contentContainerStyle={{ padding: 16 }}
      />
    </Box>
  );
};

export default AnnouncementsScreen; 