import React, { useEffect, useState } from 'react';
import { View, StyleSheet, FlatList, StatusBar, TouchableOpacity } from 'react-native';
import { Text, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserListItem, User } from 'src/components/common/UserListItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/api/axios';

interface UsuarioApi {
  id_usuario: number;
  nombre: string;
  rut: string;
  pin: string;
  es_presidente: boolean;
  disponibilidad: boolean;
  direccion: string;
}

export function UsersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [usuarios, setUsuarios] = useState<UsuarioApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('No token found');
          setLoading(false);
          return;
        }
        const response = await api.get('/usuarios', {
          headers: {
            Authorization: token,
          },
        });
        setUsuarios(response.data.usuariosEncontrados);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();

    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true); 
      fetchUsuarios();
    });

    return unsubscribe;
  }, [navigation]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
        >
          <MaterialIcons name="arrow-back-ios" size={20} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.title}>
          Vecinos
        </Text>
        <TouchableOpacity
          onPress={() => navigation.navigate('UserRegister')}
          style={styles.addButton}
        >
          <MaterialCommunityIcons name="account-plus-outline" size={24} color="#6b7280" />
        </TouchableOpacity>
      </View>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id_usuario.toString()}
        renderItem={({ item }) => (
          <UserListItem
            user={{
              id: item.id_usuario,
              nombre: item.nombre,
              rut: item.rut,
              direccion: item.direccion,
              pin: item.pin,
              disponibilidad: item.disponibilidad,
              permisos: [], 
            }}
            onPress={() => navigation.navigate('UserDetail', { id: String(item.id_usuario) })}
          />
        )}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
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
  title: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 18,
    color: '#4f46e5',
    flex: 1,
    textAlign: 'center',
    marginRight: 28,
  },
  addButton: {
    borderRadius: 999,
    padding: 4,
  },
  listContainer: {
    paddingHorizontal: 8,
    paddingBottom: 16,
  },
});
 