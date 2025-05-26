import React from 'react';
import { FlatList } from 'react-native';
import { Box } from 'native-base';
import AnnouncementCard from '@/components/AnnouncementCard';
import Header from '@/components/Header';
import { mockAnnouncements } from '@/constants/mockAnnouncements';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

// Define the navigation stack param list
export type RootStackParamList = {
  AnnouncementList: undefined;
  AnnouncementDetail: { announcement: any };
};

const AnnouncementsScreen = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <Box flex={1} bg="background">
      <Header title="Noticias" />
      <FlatList
        data={mockAnnouncements}
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