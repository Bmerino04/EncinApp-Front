import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';
import { MaterialIcons } from '@expo/vector-icons';
import { api } from 'src/api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Alert {
  id_punto_mapa: number;
  tipo: string;
  fecha_emision: string;
  estado_actividad: number;
}

const TABS = [
  { label: 'Activas', value: 1 },
  { label: 'No Activas', value: 0 },
];

export function AlertHistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [selectedTab, setSelectedTab] = useState(1);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        const response = await api.get('/alertas', { headers: { Authorization: token } });
        console.log('ALERTS RESPONSE', response.data);
        setAlerts(Array.isArray(response.data.alertasEncontradas) ? response.data.alertasEncontradas : []);
      } catch (error) {
        setAlerts([]);
      }
      setLoading(false);
    };
    fetchAlerts();
  }, []);

  const filteredAlerts = alerts.filter(a => String(a.estado_actividad) === String(selectedTab));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Registro de Alertas</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.tabsRow}>
        {TABS.map(tab => (
          <TouchableOpacity
            key={tab.value}
            style={[styles.tab, selectedTab === tab.value && styles.tabActive]}
            onPress={() => setSelectedTab(tab.value)}
          >
            <Text style={[styles.tabText, selectedTab === tab.value && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <ScrollView contentContainerStyle={styles.listContainer}>
        {filteredAlerts.map(alert => (
          <TouchableOpacity
            key={alert.id_punto_mapa}
            style={styles.alertCard}
            onPress={() => navigation.navigate('AlertDetail', { id: alert.id_punto_mapa })}
          >
            <Text style={styles.alertType}>Alerta de {capitalize(alert.tipo)}</Text>
            <View style={styles.alertMetaRow}>
              <Text style={styles.alertMeta}>{formatDate(alert.fecha_emision)}</Text>
              <Text style={styles.dot}> • </Text>
              <Text style={styles.alertMeta}>Publicada</Text>
            </View>
            <MaterialIcons name="chevron-right" size={20} color="#9ca3af" style={styles.chevron} />
          </TouchableOpacity>
        ))}
        {!loading && filteredAlerts.length === 0 && (
          <Text style={styles.emptyText}>No hay alertas en esta categoría.</Text>
        )}
      </ScrollView>
    </View>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr: string) {
  // Try to parse and format as DD MMM YYYY
  const date = new Date(dateStr.replace(/(\d{2}):(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/, '$4/$5/$6 $1:$2:$3'));
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  return dateStr;
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 1,
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
  tabsRow: {
    flexDirection: 'row',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  tabActive: {
    backgroundColor: 'white',
    borderColor: '#4f46e5',
    borderWidth: 1.5,
  },
  tabText: {
    fontFamily: 'Geist',
    fontWeight: '500',
    fontSize: 16,
    color: '#9ca3af',
  },
  tabTextActive: {
    color: '#4f46e5',
    fontWeight: '700',
  },
  listContainer: {
    paddingHorizontal: 12,
    paddingBottom: 32,
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    position: 'relative',
  },
  alertType: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 16,
    color: '#22223b',
    marginBottom: 4,
  },
  alertMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  alertMeta: {
    fontFamily: 'Geist',
    fontSize: 14,
    color: '#9ca3af',
  },
  dot: {
    fontSize: 16,
    color: '#9ca3af',
    marginHorizontal: 4,
  },
  chevron: {
    position: 'absolute',
    right: 12,
    top: '50%',
    marginTop: -10,
  },
  emptyText: {
    fontFamily: 'Geist',
    fontSize: 16,
    color: '#9ca3af',
    textAlign: 'center',
    marginTop: 32,
  },
}); 