import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Modal } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { getCurrentLocation } from 'src/utils/location';
import { api } from 'src/api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';

interface PointOfInterest {
  id_punto_interes: number;
  nombre: string;
  tipo: 'salud' | 'seguridad' | 'siniestro';
  latitud: number;
  longitud: number;
}

interface Alert {
  id_punto_mapa: number;
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
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region | null>(null);
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

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
        setPointsOfInterest(Array.isArray(poiResponse.data.puntosDeInteres) ? poiResponse.data.puntosDeInteres : []);
        setAlerts(Array.isArray(alertsResponse.data.alertasEncontradas) ? alertsResponse.data.alertasEncontradas : []);
      } catch (error) {
        console.error('Failed to fetch map data:', error);
        setPointsOfInterest([]);
        setAlerts([]);
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
                <MaterialCommunityIcons name={icon.name as any} size={20} color="white" />
              </View>
            </Marker>
          );
        })}
        {alerts.map(alert => {
          const icon = ALERT_ICONS[alert.tipo];
          return (
            <Marker
              key={`alert-${alert.id_punto_mapa}`}
              coordinate={{ latitude: alert.latitud, longitude: alert.longitud }}
              title={`Alerta de ${alert.tipo}`}
              onPress={() => setSelectedAlert(alert)}
            >
              <View style={[styles.markerContainer, { backgroundColor: icon.color }]}>
                <MaterialCommunityIcons name={icon.name as any} size={20} color="white" />
              </View>
            </Marker>
          );
        })}
      </MapView>
      {/* Alert Modal */}
      <Modal
        visible={!!selectedAlert}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedAlert(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Ver Alerta?</Text>
            <Text style={styles.modalText}>¿Quieres ver los detalles de esta alerta?</Text>
            <View style={styles.modalActions}>
              <Button mode="text" onPress={() => setSelectedAlert(null)} style={styles.modalCancel}>Cancelar</Button>
              <Button mode="contained" onPress={() => {
                if (selectedAlert) {
                  navigation.navigate('AlertDetail', { id: selectedAlert.id_punto_mapa });
                  setSelectedAlert(null);
                }
              }} style={styles.modalDelete}>Ver Alerta</Button>
            </View>
          </View>
        </View>
      </Modal>
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
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Geist',
    fontWeight: '700',
    fontSize: 18,
    color: '#4f46e5',
    marginBottom: 8,
  },
  modalText: {
    fontFamily: 'Geist',
    fontSize: 15,
    color: '#22223b',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancel: {
    backgroundColor: 'transparent',
  },
  modalDelete: {
    backgroundColor: '#4f46e5',
  },
}); 