import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, Image, StatusBar, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';
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

      setShowDelete(false);
      navigation.goBack();
    } catch (error: any) {
      console.error('Error al eliminar anuncio:', error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchAnnouncement();

    const unsubscribe = navigation.addListener('focus', fetchAnnouncement);
    return unsubscribe;
  }, [fetchAnnouncement, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!announcement) {
    return (
      <View style={styles.notFoundContainer}>
        <Text>No se encontró el anuncio.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Anuncio</Text>
        <TouchableOpacity onPress={() => setShowDelete(true)} style={styles.deleteButton}>
          <MaterialIcons name="delete-outline" size={28} color="#6b7280" />
        </TouchableOpacity>
      </View>
      <View style={styles.card}>
        <Text style={styles.title}>{announcement.titulo}</Text>
        {announcement.multimedia_url && (
          <Image
            source={{ uri: announcement.multimedia_url }}
            style={styles.image}
            resizeMode="cover"
          />
        )}
        <Text style={styles.body}>{announcement.cuerpo}</Text>
        <View style={styles.row}>
          <MaterialIcons name="location-on" size={16} color="#6b7280" />
          <Text style={styles.meta}>{announcement.direccion}</Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="event" size={16} color="#6b7280" />
          <Text style={styles.meta}>{formatDate(announcement.fecha_relacionada)}</Text>
        </View>
        <View style={styles.row}>
          <MaterialIcons name="schedule" size={16} color="#6b7280" />
          <Text style={styles.meta}>{formatTime(announcement.fecha_relacionada)}</Text>
        </View>
      </View>
      <ConfirmDeleteModal
        isOpen={showDelete}
        onCancel={() => setShowDelete(false)}
        onConfirm={handleDelete}
      />
    </View>
  );
}

function formatDate(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CL', {
    day: 'numeric',
    month: 'numeric',
    year: 'numeric',
  });
}

function formatTime(dateString: string) {
  const date = new Date(dateString);
  return date.toLocaleTimeString('es-CL', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });
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
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f6fa',
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
  headerTitle: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 18,
    color: '#4f46e5',
    flex: 1,
    textAlign: 'center',
    marginRight: 28,
  },
  deleteButton: {
    borderRadius: 999,
    padding: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    padding: 16,
    marginHorizontal: 12,
    marginTop: 8,
  },
  title: {
    fontFamily: 'Geist',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 8,
  },
  image: {
    borderRadius: 16,
    width: '100%',
    height: 180,
    marginBottom: 8,
  },
  body: {
    fontFamily: 'Geist',
    fontWeight: '400',
    fontSize: 14,
    color: '#374151',
    marginBottom: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  meta: {
    fontFamily: 'Geist',
    fontWeight: '400',
    fontSize: 14,
    color: '#374151',
  },
}); 