import React from 'react';
import { View, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
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
    <View style={styles.cardContent}>
      <Text style={styles.title}>
        {announcement.titulo}
      </Text>

      <Text style={styles.body}>
        {announcement.cuerpo}
      </Text>

      {announcement.imagenUrl !== '' && (
        <Image
          source={{ uri: announcement.imagenUrl }}
          style={styles.image}
          resizeMode="cover"
        />
      )}

      <View style={styles.locationContainer}>
        <MaterialIcons name="location-on" size={16} color="#6b7280" />
        <Text style={styles.locationText}>
          {announcement.direccionAnuncio}
        </Text>
      </View>

      <View style={styles.dateContainer}>
        <MaterialIcons name="event" size={16} color="#6b7280" />
        <Text style={styles.dateText}>
          {formatDateTime(announcement.fechaAsociada)}
        </Text>
      </View>
    </View>
  );

  if (onPress) {
    return (
      <TouchableOpacity onPress={onPress} style={styles.touchableContainer}>
        <View style={styles.card}>
          {CardContent}
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.card}>
      {CardContent}
    </View>
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

const styles = StyleSheet.create({
  touchableContainer: {
    borderRadius: 20,
    marginBottom: 16,
    marginHorizontal: 4,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    padding: 12,
  },
  cardContent: {
    gap: 8,
  },
  title: {
    fontFamily: 'Geist',
    fontWeight: '700',
    fontSize: 16,
    marginBottom: 4,
  },
  body: {
    fontFamily: 'Geist',
    fontWeight: '400',
    fontSize: 14,
    color: '#374151',
  },
  image: {
    borderRadius: 16,
    width: '100%',
    height: 180,
    marginBottom: 8,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 4,
  },
  locationText: {
    fontFamily: 'Geist',
    fontWeight: '400',
    fontSize: 14,
    color: '#374151',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  dateText: {
    fontFamily: 'Geist',
    fontWeight: '400',
    fontSize: 14,
    color: '#374151',
  },
}); 