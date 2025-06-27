import React, { useEffect, useState, useCallback } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, ScrollView } from 'react-native';
import { Text, Divider, ActivityIndicator } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from 'src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { ManagePermissionsModal } from 'src/components/common/ManagePermissionsModal';
import { TransferPresidencyModal } from 'src/components/common/TransferPresidencyModal';
import { DeleteUserModal } from 'src/components/common/DeleteUserModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/api/axios';
import { jwtDecode } from 'jwt-decode';

type UserDetailRouteProp = RouteProp<MainStackParamList, 'UserDetail'>;

interface UsuarioApi {
  id_usuario: number;
  nombre: string;
  rut: string;
  pin: string;
  es_presidente: boolean;
  disponibilidad: boolean;
  direccion: string;
}

export function UserDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<UserDetailRouteProp>();
  const { id } = route.params;

  const [user, setUser] = useState<UsuarioApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [showPermModal, setShowPermModal] = useState(false);
  const [showTransferModal, setShowTransferModal] = useState(false);
  const [esPresidente, setEsPresidente] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const fetchUsuario = useCallback(async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token no encontrado');

      const decoded: any = jwtDecode(token);
      const currentId = decoded.id;
      setCurrentUserId(currentId);

      const response = await api.get(`/usuarios/${id}`, {
        headers: { Authorization: token },
      });

      const datos: UsuarioApi = response.data.usuarioEncontrado;
      setUser(datos);
      setEsPresidente(datos.es_presidente);
    } catch (error) {
      console.error('Error fetching user detail:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchUsuario();

    const unsubscribe = navigation.addListener('focus', () => {
      fetchUsuario();
    });

    return unsubscribe;
  }, [fetchUsuario, navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!user) {
    return (
      <View style={styles.notFoundContainer}>
        <Text style={styles.notFoundText}>No se encontró el usuario.</Text>
      </View>
    );
  }

  const isViewingOwnProfile = currentUserId === user.id_usuario;

  return (
    <ScrollView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vecino</Text>
        <View style={{ width: 28 }} />
      </View>
      <View style={styles.centeredInfo}>
        <Text style={styles.name}>{user.nombre}</Text>
        <Text style={styles.rut}>{user.rut}</Text>
        <Text style={styles.address}>{user.direccion}</Text>
        <Text style={styles.status}>{user.disponibilidad ? 'Disponible' : 'No disponible'}</Text>
      </View>
      <View style={styles.card}>
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('EditUserName', {
              id: String(user.id_usuario),
              value: user.nombre,
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
              id: String(user.id_usuario),
              value: user.direccion,
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
              id: String(user.id_usuario),
            })
          }
        >
          <View style={styles.cardItem}>
            <Text style={styles.cardItemText}>Cambiar Pin</Text>
          </View>
        </TouchableOpacity>
        <Divider />
        {!isViewingOwnProfile && (
          <TouchableOpacity onPress={() => setShowPermModal(true)}>
            <View style={styles.cardItem}>
              <Text style={styles.cardItemText}>Gestionar Permisos</Text>
            </View>
          </TouchableOpacity>
        )}
        {!isViewingOwnProfile && <Divider />}
        {!isViewingOwnProfile && esPresidente && (
          <TouchableOpacity onPress={() => setShowTransferModal(true)}>
            <View style={styles.cardItem}>
              <Text style={styles.cardItemText}>Transferir Presidencia</Text>
            </View>
          </TouchableOpacity>
        )}
        {!isViewingOwnProfile && esPresidente && <Divider />}
        {!isViewingOwnProfile && (
          <TouchableOpacity onPress={() => setShowDeleteModal(true)}>
            <View style={styles.cardItemDanger}>
              <Text style={styles.cardItemDangerText}>Eliminar Usuario</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>
      <ManagePermissionsModal
        isOpen={showPermModal}
        onClose={() => setShowPermModal(false)}
        idUsuario={user.id_usuario}
      />
      <TransferPresidencyModal
        isOpen={showTransferModal}
        onCancel={() => setShowTransferModal(false)}
        onConfirm={() => {
          setShowTransferModal(false);
          fetchUsuario();
        }}
        userName={user.nombre}
      />
      <DeleteUserModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        idUsuario={user.id_usuario}
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
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f5f6fa',
  },
  notFoundText: {
    fontFamily: 'Geist',
    fontSize: 16,
    color: '#9ca3af',
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
  status: {
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