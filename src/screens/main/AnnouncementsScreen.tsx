import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, StatusBar } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { AnnouncementCard, Announcement } from 'src/components/common/AnnouncementCard';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/api/axios';
import { TouchableOpacity } from 'react-native';

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
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.title}>
          Noticias
        </Text>
        <View style={styles.spacer} />
      </View>
      <FlatList
        data={anuncios}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <AnnouncementCard
            announcement={item}
            onPress={() => navigation.navigate('AnnouncementDetail', { id: String(item.id) })}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 1,
  },
  backButton: {
    borderRadius: 999,
    padding: 4,
  },
  title: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 18,
    color: '#4f46e5',
    flex: 1,
    textAlign: 'center',
    marginRight: 28,
  },
  spacer: {
    width: 28,
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
});