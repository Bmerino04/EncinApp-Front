import React from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'SelectAlertType'>;

const ALERT_TYPES = [
  {
    label: 'Alerta de\nSeguridad',
    icon: <MaterialCommunityIcons name="incognito" size={48} color="white" />,
    color: '#22c55e',
    borderColor: '#16a34a',
    type: 'seguridad',
  },
  {
    label: 'Alerta de\nSalud',
    icon: <MaterialCommunityIcons name="heart-pulse" size={48} color="white" />,
    color: '#3b82f6',
    borderColor: '#2563eb',
    type: 'salud',
  },
  {
    label: 'Alerta de\nSiniestro',
    icon: <MaterialCommunityIcons name="fire" size={48} color="white" />,
    color: '#f97316',
    borderColor: '#ea580c',
    type: 'siniestro',
  },
] as const;

export function SelectAlertTypeScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handlePress = (alertType: 'seguridad' | 'salud' | 'siniestro') => {
    navigation.navigate('CreateAlert', { alertType });
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Seleccionar Tipo</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.content}>
        {ALERT_TYPES.map((alert, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.alertButton,
              { backgroundColor: alert.color, borderColor: alert.borderColor },
            ]}
            onPress={() => handlePress(alert.type)}
          >
            {alert.icon}
            <Text style={styles.alertText}>{alert.label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 24,
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
  content: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 24,
    gap: 32,
  },
  alertButton: {
    width: '75%',
    maxWidth: 300,
    height: 150,
    borderRadius: 24,
    borderWidth: 4,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 8,
    gap: 8,
  },
  alertText: {
    fontFamily: 'Geist',
    fontWeight: '700',
    fontSize: 24,
    color: 'white',
    textAlign: 'center',
  },
}); 