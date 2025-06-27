import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, Switch, ScrollView } from 'react-native';
import { Text, Divider, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LogoutConfirmModal } from 'src/components/common/LogoutConfirmModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/api/axios';
import { jwtDecode } from 'jwt-decode';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';

interface UsuarioApi {
  id_usuario: number;
  nombre: string;
  rut: string;
  pin: string;
  es_presidente: boolean;
  disponibilidad: boolean;
  direccion: string;
}

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'PersonalInfo'>;

interface PersonalInfoScreenProps {
  onLogout: () => void;
}

export function PersonalInfoScreen({ onLogout }: PersonalInfoScreenProps) {
  const navigation = useNavigation<NavigationProp>();
  const [usuario, setUsuario] = useState<UsuarioApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isToggling, setIsToggling] = useState(false);

  const fetchUsuario = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token no encontrado');

      const decoded: any = jwtDecode(token);
      const id_usuario = decoded.id;

      const response = await api.get(`usuarios/${id_usuario}`, {
        headers: { Authorization: token },
      });

      setUsuario(response.data.usuarioEncontrado);
    } catch (error) {
      console.error('Error al obtener datos del usuario:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsuario();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchUsuario();
    });

    return unsubscribe;
  }, [fetchUsuario, navigation]);

  const toggleDisponibilidad = async () => {
    if (!usuario || isToggling) return;

    setIsToggling(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token no encontrado');

      const nuevaDisponibilidad = !usuario.disponibilidad;

      const response = await api.patch(
        `/usuarios/${usuario.id_usuario}/disponibilidad`,
        { disponibilidad: nuevaDisponibilidad },
        { headers: { Authorization: token } }
      );

      if (response.status === 200) {
        setUsuario({ ...usuario, disponibilidad: nuevaDisponibilidad });
      }
    } catch (error) {
      console.error('Error al actualizar disponibilidad:', error);
    } finally {
      setIsToggling(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      onLogout();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };

  if (loading || !usuario) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Información Personal</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.centeredInfo}>
        <Text style={styles.name}>{usuario.nombre}</Text>
        <Text style={styles.rut}>{usuario.rut}</Text>
        <Text style={styles.address}>{usuario.direccion}</Text>
      </View>
      <View style={styles.card}>
        <View style={styles.row}>
          <Text style={styles.cardItemText}>Disponibilidad</Text>
          <Switch
            value={usuario.disponibilidad}
            onValueChange={toggleDisponibilidad}
            disabled={isToggling}
            trackColor={{ false: '#e5e7eb', true: '#7f9cf5' }}
            thumbColor={usuario.disponibilidad ? '#4f46e5' : '#f4f3f4'}
          />
        </View>
        <Divider />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditUserName', {
              id: String(usuario.id_usuario),
              value: usuario.nombre,
            })
          }
        >
          <View style={styles.cardItem}>
            <Text style={styles.cardItemText}>Cambiar Nombre</Text>
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditUserAddress', {
              id: String(usuario.id_usuario),
              value: usuario.direccion,
            })
          }
        >
          <View style={styles.cardItem}>
            <Text style={styles.cardItemText}>Cambiar Dirección</Text>
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditUserPin', {
              id: String(usuario.id_usuario),
            })
          }
        >
          <View style={styles.cardItem}>
            <Text style={styles.cardItemText}>Cambiar Pin</Text>
          </View>
        </TouchableOpacity>
        <Divider />
        <TouchableOpacity onPress={() => setShowLogoutModal(true)}>
          <View style={styles.cardItemDanger}>
            <Text style={styles.cardItemDangerText}>Cerrar sesión</Text>
          </View>
        </TouchableOpacity>
      </View>
      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={handleLogout}
      />
    </ScrollView>
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
  centeredInfo: {
    alignItems: 'center',
    marginBottom: 32,
  },
  name: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 18,
    marginTop: 8,
  },
  rut: {
    fontFamily: 'Geist',
    fontWeight: '400',
    fontSize: 16,
    color: '#6b7280',
  },
  address: {
    fontFamily: 'Geist',
    fontWeight: '400',
    fontSize: 16,
    color: '#9ca3af',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
    marginHorizontal: 12,
    marginBottom: 24,
    overflow: 'hidden',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardItem: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  cardItemText: {
    fontFamily: 'Geist',
    fontWeight: '400',
    fontSize: 16,
  },
  cardItemDanger: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fee2e2',
  },
  cardItemDangerText: {
    fontFamily: 'Geist',
    fontWeight: '400',
    fontSize: 16,
    color: '#d20f39',
  },
});