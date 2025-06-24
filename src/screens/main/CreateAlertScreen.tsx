import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Linking } from 'react-native';
import { Text, Button, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';
import { api } from 'src/api/axios';
import { getCurrentLocation, reverseGeocode, calculateDistance } from 'src/utils/location';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ALERT_CONFIG = {
  seguridad: {
    label: 'Alerta de Seguridad',
    icon: <MaterialCommunityIcons name="incognito" size={48} color="#16a34a" />,
    color: '#e7f9ee',
  },
  salud: {
    label: 'Alerta de Salud',
    icon: <MaterialCommunityIcons name="heart-pulse" size={48} color="#2563eb" />,
    color: '#e9effd',
  },
  siniestro: {
    label: 'Alerta de Siniestro',
    icon: <MaterialCommunityIcons name="fire" size={48} color="#ea580c" />,
    color: '#fdf1e7',
  },
};

type CreateAlertRouteProp = RouteProp<MainStackParamList, 'CreateAlert'>;

interface PointOfInterest {
  id_punto_interes: number;
  nombre: string;
  tipo: string;
  latitud: number;
  longitud: number;
  contacto: string;
  distancia?: string;
  id_punto_mapa: number;
}

export function CreateAlertScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<CreateAlertRouteProp>();
  const { alertType } = route.params;

  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(
    null
  );
  const [userAddress, setUserAddress] = useState<string>('Obteniendo ubicación...');
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);
  const [alertSent, setAlertSent] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const config = ALERT_CONFIG[alertType];

  useEffect(() => {
    const setup = async () => {
      setLoading(true);
      const location = await getCurrentLocation();
      if (location) {
        setUserLocation(location);
        const address = await reverseGeocode(location);
        setUserAddress(address);
        try {
          const token = await AsyncStorage.getItem('userToken');
          const response = await api.get('/puntos-interes', {
            headers: { Authorization: token },
          });

          console.log('POI RESPONSE', response.data);
          const points = Array.isArray(response.data.puntosInteresEncontrados) ? response.data.puntosInteresEncontrados : [];
          const typedPoints = points.filter((p: PointOfInterest) => p.tipo === alertType);
          const pointsWithDistance = typedPoints.map((p: PointOfInterest) => ({
            ...p,
            distancia: calculateDistance(location.latitude, location.longitude, p.latitud, p.longitud),
          }));

          setPointsOfInterest(pointsWithDistance);
        } catch (error) {
          console.error('Failed to fetch points of interest', error);
        }
      } else {
        setUserAddress('No se pudo obtener la ubicación');
      }
      setLoading(false);
    };

    setup();
  }, [alertType]);

  const handleConfirmAlert = async () => {
    if (!userLocation || submitting) return;
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      await api.post(
        '/alertas',
        {
          tipo: alertType,
          latitud: userLocation.latitude,
          longitud: userLocation.longitude,
        },
        { headers: { Authorization: token } }
      );
      setAlertSent(true);
    } catch (error) {
      console.error('Failed to send alert', error);
      // Here you might want to show a toast to the user
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelAlert = () => {
    navigation.goBack();
  };

  const handleDone = () => {
    navigation.popToTop();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <ScrollView>
        <View style={[styles.topCard, { backgroundColor: config.color }]}>
          {config.icon}
          <Text style={styles.topCardTitle}>{config.label}</Text>
          <Text style={styles.topCardSubtitle}>
            {alertSent ? 'Enviada de Forma Exitosa' : 'A punto de ser enviada'}
          </Text>
          <View style={styles.locationContainer}>
            <MaterialIcons name="location-on" size={16} color="#6b7280" />
            <Text style={styles.locationText}>{userAddress}</Text>
          </View>
        </View>

        {!alertSent && (
          <View style={styles.warningBox}>
            <MaterialIcons name="warning" size={24} color="#f97316" />
            <Text style={styles.warningText}>Considera Llamar a</Text>
          </View>
        )}

        {pointsOfInterest.map(point => (
          <View key={point.id_punto_mapa} style={styles.poiCard}>
            <Text style={styles.poiName}>{point.nombre}</Text>
            <View style={styles.poiContact}>
              <MaterialIcons name="phone" size={16} color="#6b7280" />
              <Text style={styles.poiContactText}>{point.contacto}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        {alertSent ? (
          <Button mode="contained" onPress={handleDone} style={styles.acceptButton}>
            Aceptar
          </Button>
        ) : (
          <>
            <Button
              mode="contained"
              onPress={handleConfirmAlert}
              style={styles.acceptButton}
              loading={submitting}
              disabled={submitting}
            >
              Confirmar Alerta
            </Button>
            <Button
              mode="text"
              onPress={handleCancelAlert}
              style={styles.cancelButton}
              labelStyle={styles.cancelButtonText}
              disabled={submitting}
            >
              Cancelar Alerta
            </Button>
          </>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  topCard: {
    margin: 16,
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  topCardTitle: { fontFamily: 'Geist', fontSize: 20, fontWeight: '600', marginTop: 16 },
  topCardSubtitle: { fontFamily: 'Geist', fontSize: 16, color: '#374151', marginTop: 4 },
  locationContainer: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  locationText: { fontFamily: 'Geist', fontSize: 14, color: '#6b7280', marginLeft: 4 },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fffbeB',
    marginHorizontal: 16,
    padding: 16,
    borderRadius: 12,
  },
  warningText: { fontFamily: 'Geist', fontSize: 16, fontWeight: '500', marginLeft: 8 },
  poiCard: {
    backgroundColor: 'white',
    marginHorizontal: 16,
    marginTop: 12,
    borderRadius: 12,
    padding: 16,
  },
  poiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  poiName: { fontFamily: 'Geist', fontSize: 16, fontWeight: '600' },
  poiDistanceContainer: { flexDirection: 'row', alignItems: 'center' },
  poiDistance: { fontFamily: 'Geist', fontSize: 14, color: '#6b7280', marginLeft: 4 },
  poiContact: { flexDirection: 'row', alignItems: 'center' },
  poiContactText: { fontFamily: 'Geist', fontSize: 16, color: '#374151', marginLeft: 8 },
  footer: { padding: 16, borderTopWidth: 1, borderTopColor: '#e5e7eb', backgroundColor: '#f5f6fa' },
  acceptButton: { borderRadius: 12, paddingVertical: 8 },
  cancelButton: { marginTop: 8 },
  cancelButtonText: { color: '#6b7280', fontFamily: 'Geist', fontWeight: '600' },
  poiAddressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  poiAddressText: {
    fontFamily: 'Geist',
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
    flexShrink: 1,
  },
});
 