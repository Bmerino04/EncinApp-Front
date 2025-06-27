import React, { useEffect, useState, useRef, useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, Modal } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import MapView, { Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { getCurrentLocation, calculateDistance } from 'src/utils/location';
import { api } from 'src/api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';
import { Modalize } from 'react-native-modalize';
import 'react-native-gesture-handler';

interface PointOfInterest {
  id_punto_mapa: number;
  nombre: string;
  tipo: 'salud' | 'seguridad' | 'siniestro';
  latitud: number;
  longitud: number;
  contacto: string;
}

interface Alert {
  id_punto_mapa: number;
  tipo: 'salud' | 'seguridad' | 'siniestro';
  latitud: number;
  longitud: number;
}

const POI_ICONS = {
  salud: { name: 'hospital-box-outline', color: '#06b6d4' },
  seguridad: { name: 'police-badge-outline', color: '#22c55e' },
  siniestro: { name: 'phone', color: '#eab308' },
};

const ALERT_ICONS = {
  salud: { name: 'alert-outline', color: '#ef4444' },
  seguridad: { name: 'alert-outline', color: '#f59e0b' },
  siniestro: { name: 'alert-outline', color: '#dc2626' },
};

export function MapScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [loading, setLoading] = useState(true);
  const [region, setRegion] = useState<Region | null>(null);
  const [pointsOfInterest, setPointsOfInterest] = useState<PointOfInterest[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [selectedPOI, setSelectedPOI] = useState<PointOfInterest | null>(null);
  const [filterType, setFilterType] = useState<'all' | 'salud' | 'seguridad' | 'siniestro'>('all');
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const modalizeRef = useRef<Modalize>(null);

  // Memoized filtered and sorted POIs
  const filteredPOIs = useMemo(() => {
    let pois = pointsOfInterest;
    if (filterType !== 'all') {
      pois = pois.filter((poi) => poi.tipo === filterType);
    }
    if (userLocation) {
      return [...pois].sort((a, b) => {
        const distA = parseFloat(calculateDistance(userLocation.latitude, userLocation.longitude, a.latitud, a.longitud));
        const distB = parseFloat(calculateDistance(userLocation.latitude, userLocation.longitude, b.latitud, b.longitud));
        return distA - distB;
      });
    }
    return pois;
  }, [pointsOfInterest, filterType, userLocation]);

  const fetchMapData = async () => {
    setLoading(true);
    const location = await getCurrentLocation();
    if (location) {
      setRegion({
        latitude: location.latitude,
        longitude: location.longitude,
        latitudeDelta: 0.02,
        longitudeDelta: 0.02,
      });
      setUserLocation({ latitude: location.latitude, longitude: location.longitude });
    }
    try {
      const token = await AsyncStorage.getItem('userToken');
      const [poiResponse, alertsResponse] = await Promise.all([
        api.get('/puntos-interes', { headers: { Authorization: token } }),
        api.get('/alertas?estado=1', { headers: { Authorization:token } }),
      ]);
      setPointsOfInterest(Array.isArray(poiResponse.data.puntosInteresEncontrados) ? poiResponse.data.puntosInteresEncontrados : []);
      setAlerts(Array.isArray(alertsResponse.data.alertasEncontradas) ? alertsResponse.data.alertasEncontradas : []);
    } catch (error) {
      console.error('Failed to fetch map data:', error);
      setPointsOfInterest([]);
      setAlerts([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchMapData();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      fetchMapData();
    }, [])
  );

  if (loading || !region) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
        <Text>Cargando mapa...</Text>
      </View>
    );
  }

  console.log('Rendering MapScreen: before bottom view');
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
      {/* Modalize bottom sheet with POI filter and list */}
      <Modalize
        ref={modalizeRef}
        modalHeight={400}
        alwaysOpen={100}
        handlePosition="inside"
      >
        <View style={{ padding: 16 }}>
          <View style={styles.filterRow}>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'all' && styles.filterButtonActive]}
              onPress={() => setFilterType('all')}
            >
              <MaterialCommunityIcons name="format-list-bulleted" size={20} color={filterType === 'all' ? '#4f46e5' : '#6b7280'} />
              <Text style={[styles.filterButtonText, filterType === 'all' && styles.filterButtonTextActive]}>Todos</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'seguridad' && styles.filterButtonActive]}
              onPress={() => setFilterType('seguridad')}
            >
              <MaterialCommunityIcons name="police-badge-outline" size={20} color={filterType === 'seguridad' ? '#22c55e' : '#6b7280'} />
              <Text style={[styles.filterButtonText, filterType === 'seguridad' && styles.filterButtonTextActive]}>Seguridad</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'salud' && styles.filterButtonActive]}
              onPress={() => setFilterType('salud')}
            >
              <MaterialCommunityIcons name="hospital-box-outline" size={20} color={filterType === 'salud' ? '#06b6d4' : '#6b7280'} />
              <Text style={[styles.filterButtonText, filterType === 'salud' && styles.filterButtonTextActive]}>Salud</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, filterType === 'siniestro' && styles.filterButtonActive]}
              onPress={() => setFilterType('siniestro')}
            >
              <MaterialCommunityIcons name="phone" size={20} color={filterType === 'siniestro' ? '#eab308' : '#6b7280'} />
              <Text style={[styles.filterButtonText, filterType === 'siniestro' && styles.filterButtonTextActive]}>Siniestro</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.poiListContainer}>
          <Button
            mode="contained"
            style={{ margin: 16, backgroundColor: '#4f46e5', borderRadius: 8 }}
            onPress={() => navigation.navigate('CreatePOI')}
          >
            Crear Punto de Interés
          </Button>
            {filteredPOIs.length === 0 ? (
              <Text style={styles.noPOIText}>No hay puntos de interés cercanos.</Text>
            ) : (
              filteredPOIs.map((poi) => {
                let distance = userLocation ? calculateDistance(userLocation.latitude, userLocation.longitude, poi.latitud, poi.longitud) : null;
                return (
                  <TouchableOpacity
                    key={`sheet-poi-${poi.id_punto_mapa}`}
                    style={[styles.poiCard, { backgroundColor: POI_ICONS[poi.tipo].color + '22' }]}
                    onPress={() => setSelectedPOI(poi)}
                  >
                    <View style={styles.poiCardHeader}>
                      <Text style={styles.poiCardTitle}>{poi.nombre}</Text>
                    </View>
                    {distance && (
                      <View style={styles.poiDistanceContainer}>
                        <MaterialIcons name="location-on" size={16} color="#6b7280" />
                        <Text style={styles.poiDistanceText}>A {distance} km</Text>
                      </View>
                    )}
                    <View style={styles.poiCardRow}>
                      <MaterialIcons name="phone" size={16} color="#6b7280" />
                      <Text style={styles.poiCardContact}>{poi.contacto}</Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </View>
      </Modalize>
      <MapView style={styles.map} initialRegion={region} provider={PROVIDER_GOOGLE} showsUserLocation>
        {filteredPOIs.map(poi => {
          const icon = POI_ICONS[poi.tipo];
          return (
            <Marker
              key={`poi-${poi.id_punto_mapa}`}
              coordinate={{ latitude: poi.latitud, longitude: poi.longitud }}
              title={poi.nombre}
              onPress={() => setSelectedPOI(poi)}
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
      {/* POI Details Modal */}
      <Modal
        visible={!!selectedPOI}
        transparent
        animationType="fade"
        onRequestClose={() => setSelectedPOI(null)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{selectedPOI?.nombre}</Text>
            <View style={styles.poiInfoContainer}>
              <Text style={styles.poiInfoLabel}>Contacto:</Text>
              <Text style={styles.poiInfoValue}>{selectedPOI?.contacto}</Text>
            </View>
            <View style={styles.poiInfoContainer}>
              <Text style={styles.poiInfoLabel}>Tipo:</Text>
              <Text style={styles.poiInfoValue}>{selectedPOI?.tipo}</Text>
            </View>
            <Button mode="contained" onPress={() => setSelectedPOI(null)} style={styles.modalDelete}>
              Cerrar
            </Button>
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
  poiInfoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  poiInfoLabel: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 15,
    color: '#22223b',
    marginRight: 8,
  },
  poiInfoValue: {
    fontFamily: 'Geist',
    fontSize: 15,
    color: '#22223b',
  },
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 16,
  },
  filterButton: {
    padding: 8,
    borderWidth: 1,
    borderColor: '#6b7280',
    borderRadius: 8,
  },
  filterButtonActive: {
    borderColor: '#4f46e5',
  },
  filterButtonText: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 15,
    color: '#6b7280',
  },
  filterButtonTextActive: {
    color: '#4f46e5',
  },
  poiListContainer: {
    flex: 1,
  },
  noPOIText: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 15,
    color: '#6b7280',
    textAlign: 'center',
    marginTop: 16,
  },
  poiCard: {
    padding: 16,
    borderWidth: 1,
    borderColor: '#6b7280',
    borderRadius: 8,
    marginBottom: 8,
  },
  poiCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  poiCardTitle: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 15,
    color: '#22223b',
  },
  poiDistanceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 8,
  },
  poiDistanceText: {
    fontFamily: 'Geist',
    fontSize: 12,
    color: '#6b7280',
  },
  poiCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  poiCardContact: {
    fontFamily: 'Geist',
    fontSize: 12,
    color: '#22223b',
    marginLeft: 8,
  },
}); 