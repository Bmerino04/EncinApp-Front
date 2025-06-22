import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { getCurrentLocation } from 'src/utils/location';
import { api } from 'src/api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface PointOfInterest {
  id_punto_interes: number;
  nombre: string;
  tipo: 'salud' | 'seguridad' | 'siniestro';
  latitud: number;
  longitud: number;
}

interface Alert {
  id_alerta: number;
  tipo: 'salud' | 'seguridad' | 'siniestro';
  latitud: number;
  longitud: number;
}

const POI_ICONS = {
  salud: { name: 'hospital-box', color: '#16a34a' },
  seguridad: { name: 'shield-check', color: '#3b82f6' },
  siniestro: { name: 'fire-truck', color: '#f97316' },
};

const ALERT_ICONS = {
  salud: { name: 'heart-pulse', color: '#ef4444' },
  seguridad: { name: 'shield-alert', color: '#f59e0b' },
  siniestro: { name: 'fire', color: '#dc2626' },
};

export function MapScreen() {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region | null>(null);
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const location = await getCurrentLocation();
      if (location) {
        setRegion({
          latitude: location.latitude,
          longitude: location.longitude,
          latitudeDelta: 0.02,
          longitudeDelta: 0.02,
        });
      }

      try {
        const token = await AsyncStorage.getItem('userToken');
        const [poiResponse, alertsResponse] = await Promise.all([
          api.get('/puntos-interes', { headers: { Authorization: token } }),
          api.get('/alertas', { headers: { Authorization:token } }),
        ]);
        setPointsOfInterest(poiResponse.data.puntosDeInteres);
        setAlerts(alertsResponse.data.alertas);
      } catch (error) {
        console.error('Failed to fetch map data:', error);
      }
      setLoading(false);
    };

    fetchData();
  }, []);

  if (loading || !region) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>Cargando mapa...</Text>
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
        <Text style={styles.headerTitle}>Mapa</Text>
        <View style={{ width: 28 }} />
      </View>
      <MapView style={styles.map} initialRegion={region} provider={PROVIDER_GOOGLE} showsUserLocation>
        {pointsOfInterest.map(poi => {
          const icon = POI_ICONS[poi.tipo];
          return (
            <Marker
              key={`poi-${poi.id_punto_interes}`}
              coordinate={{ latitude: poi.latitud, longitude: poi.longitud }}
              title={poi.nombre}
            >
              <View style={[styles.markerContainer, { backgroundColor: icon.color }]}>
                <MaterialCommunityIcons name={icon.name as any} size={24} color="white" />
              </View>
            </Marker>
          );
        })}
        {alerts.map(alert => {
          const icon = ALERT_ICONS[alert.tipo];
          return (
            <Marker
              key={`alert-${alert.id_alerta}`}
              coordinate={{ latitude: alert.latitud, longitude: alert.longitud }}
              title={`Alerta de ${alert.tipo}`}
            >
              <View style={[styles.markerContainer, { backgroundColor: icon.color }]}>
                <MaterialCommunityIcons name={icon.name as any} size={24} color="white" />
              </View>
            </Marker>
          );
        })}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 12,
    paddingHorizontal: 8,
    paddingVertical: 8,
    position: 'absolute',
    top: 10,
    left: 0,
    right: 0,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  backButton: { borderRadius: 999, padding: 4 },
  headerTitle: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 18,
    color: '#4f46e5',
    flex: 1,
    textAlign: 'center',
    marginRight: 28,
  },
  map: { flex: 1 },
  markerContainer: {
    padding: 8,
    borderRadius: 999,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
}); 