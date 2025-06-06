import React, { useEffect, useState, useCallback } from 'react';
import {
  Box,
  Text,
  IconButton,
  Icon,
  StatusBar,
  VStack,
  Divider,
  Pressable,
  Spinner,
  Center,
} from 'native-base';
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
  const [permisos, setPermisos] = useState<string[]>([]);
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
      setPermisos([]);
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
      <Box flex={1} bg="#f5f6fa">
        <Center flex={1}>
          <Spinner size="lg" />
        </Center>
      </Box>
    );
  }

  if (!user) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center" bg="#f5f6fa">
        <Text fontFamily="Geist" fontSize="md" color="muted.500">
          No se encontró el usuario.
        </Text>
      </Box>
    );
  }

  const isViewingOwnProfile = currentUserId === user.id_usuario;

  return (
    <Box flex={1} bg="#f5f6fa">
      <StatusBar barStyle="dark-content" />
      <Box safeAreaTop bg="#f5f6fa" />
      <Box
        flexDirection="row"
        alignItems="center"
        bg="white"
        borderRadius={16}
        mx={3}
        mt={3}
        mb={6}
        px={2}
        py={2}
        shadow={1}
      >
        <IconButton
          icon={<Icon as={MaterialIcons} name="arrow-back-ios" size={5} color="primary" />}
          borderRadius="full"
          variant="ghost"
          onPress={() => navigation.goBack()}
        />
        <Text
          fontFamily="Geist"
          fontWeight="600"
          fontSize="lg"
          color="primary"
          flex={1}
          textAlign="center"
          mr={7}
        >
          Vecino
        </Text>
      </Box>

      <VStack alignItems="center" space={1} mb={8}>
        <Text fontFamily="Geist" fontWeight="600" fontSize="lg" mt={2}>
          {user.nombre}
        </Text>
        <Text fontFamily="Geist" fontWeight="400" fontSize="md" color="muted.500">
          {user.rut}
        </Text>
        <Text fontFamily="Geist" fontWeight="400" fontSize="md" color="muted.400">
          {user.direccion}
        </Text>
        <Text fontFamily="Geist" fontWeight="400" fontSize="md" color="muted.400">
          {user.disponibilidad ? 'Disponible' : 'No disponible'}
        </Text>
      </VStack>

      <Box bg="white" borderRadius={20} shadow={2} mx={3}>
        <VStack divider={<Divider />}>
          <Pressable
            onPress={() =>
              navigation.navigate('EditUserName', {
                id: String(user.id_usuario),
                value: user.nombre,
              })
            }
          >
            <Box px={5} py={4}>
              <Text fontFamily="Geist" fontWeight="400" fontSize="md">Cambiar Nombre</Text>
            </Box>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate('EditUserAddress', {
                id: String(user.id_usuario),
                value: user.direccion,
              })
            }
          >
            <Box px={5} py={4}>
              <Text fontFamily="Geist" fontWeight="400" fontSize="md">Cambiar Dirección</Text>
            </Box>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate('EditUserPin', {
                id: String(user.id_usuario),
              })
            }
          >
            <Box px={5} py={4}>
              <Text fontFamily="Geist" fontWeight="400" fontSize="md">Cambiar Pin</Text>
            </Box>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate('EditUserRut', {
                id: String(user.id_usuario),
                value: user.rut,
              })
            }
          >
            <Box px={5} py={4}>
              <Text fontFamily="Geist" fontWeight="400" fontSize="md">Cambiar Rut</Text>
            </Box>
          </Pressable>

          <Pressable onPress={() => setShowPermModal(true)}>
            <Box px={5} py={4}>
              <Text fontFamily="Geist" fontWeight="400" fontSize="md">Gestionar Permisos</Text>
            </Box>
          </Pressable>

          <Pressable onPress={() => setShowTransferModal(true)}>
            <Box px={5} py={4}>
              <Text fontFamily="Geist" fontWeight="400" fontSize="md">Transferir Presidencia</Text>
            </Box>
          </Pressable>

          {!isViewingOwnProfile && (
            <Pressable onPress={() => setShowDeleteModal(true)}>
              <Box px={5} py={4}>
                <Text fontFamily="Geist" fontWeight="400" fontSize="md">Eliminar Cuenta</Text>
              </Box>
            </Pressable>
          )}
        </VStack>
      </Box>

      {/* Modales */}
      <ManagePermissionsModal
        isOpen={showPermModal}
        onClose={() => setShowPermModal(false)}
        idUsuario={user.id_usuario}
      />

      <TransferPresidencyModal
        isOpen={showTransferModal}
        onCancel={() => setShowTransferModal(false)}
        onConfirm={() => {
          setEsPresidente(false);
          setShowTransferModal(false);
        }}
        userName={user.nombre}
      />

      <DeleteUserModal
        isOpen={showDeleteModal}
        onCancel={() => setShowDeleteModal(false)}
        idUsuario={user.id_usuario}
      />
    </Box>
  );
}