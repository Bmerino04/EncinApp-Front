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
  Switch,
  HStack,
  Spinner,
  useToast,
  Center,
} from 'native-base';
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
  onLogout: () => void;  // <-- nueva prop
}

export function PersonalInfoScreen({ onLogout }: PersonalInfoScreenProps) {
  const navigation = useNavigation<NavigationProp>();
  const [usuario, setUsuario] = useState<UsuarioApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isToggling, setIsToggling] = useState(false);
  const toast = useToast();

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
        toast.show({
          description: 'Disponibilidad actualizada',
          placement: 'top',
        });
      }
    } catch (error) {
      console.error('Error al actualizar disponibilidad:', error);
      toast.show({
        description: 'Error al actualizar disponibilidad',
        placement: 'top',
      });
    } finally {
      setIsToggling(false);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      onLogout(); // Actualiza estado global de autenticación
      // navigation.reset({ index: 0, routes: [{ name: 'Auth' }] }); // No necesario porque el cambio de estado cambia la navegación
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
      toast.show({
        description: 'Error al cerrar sesión',
        placement: 'top',
      });
    }
  };

  if (loading || !usuario) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Box>
    );
  }

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
          Información Personal
        </Text>
      </Box>

      <VStack alignItems="center" space={1} mb={8}>
        <Text fontFamily="Geist" fontWeight="600" fontSize="lg" mt={2}>
          {usuario.nombre}
        </Text>
        <Text fontFamily="Geist" fontWeight="400" fontSize="md" color="muted.500">
          {usuario.rut}
        </Text>
        <Text fontFamily="Geist" fontWeight="400" fontSize="md" color="muted.400">
          {usuario.direccion}
        </Text>
      </VStack>

      <Box bg="white" borderRadius={20} shadow={2} mx={3}>
        <VStack divider={<Divider />}>
          <HStack alignItems="center" justifyContent="space-between" px={5} py={4}>
            <Text fontFamily="Geist" fontWeight="400" fontSize="md">
              Disponibilidad
            </Text>
            <Switch
              isChecked={usuario.disponibilidad}
              isDisabled={isToggling}
              onToggle={toggleDisponibilidad}
              offTrackColor="muted.300"
              onTrackColor="primary.400"
            />
          </HStack>

          <Pressable
            onPress={() =>
              navigation.navigate('EditUserName', {
                id: String(usuario.id_usuario),
                value: usuario.nombre,
              })
            }
          >
            <Box px={5} py={4}>
              <Text fontFamily="Geist" fontWeight="400" fontSize="md">
                Cambiar Nombre
              </Text>
            </Box>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate('EditUserAddress', {
                id: String(usuario.id_usuario),
                value: usuario.direccion,
              })
            }
          >
            <Box px={5} py={4}>
              <Text fontFamily="Geist" fontWeight="400" fontSize="md">
                Cambiar Dirección
              </Text>
            </Box>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate('EditUserRut', {
                id: String(usuario.id_usuario),
                value: usuario.rut,
              })
            }
          >
            <Box px={5} py={4}>
              <Text fontFamily="Geist" fontWeight="400" fontSize="md">
                Cambiar Rut
              </Text>
            </Box>
          </Pressable>

          <Pressable
            onPress={() =>
              navigation.navigate('EditUserPin', {
                id: String(usuario.id_usuario),
              })
            }
          >
            <Box px={5} py={4}>
              <Text fontFamily="Geist" fontWeight="400" fontSize="md">
                Cambiar Pin
              </Text>
            </Box>
          </Pressable>

          <Pressable onPress={() => setShowLogoutModal(true)}>
            <Box px={5} py={4}>
              <Text fontFamily="Geist" fontWeight="400" fontSize="md">
                Cerrar sesión
              </Text>
            </Box>
          </Pressable>
        </VStack>
      </Box>

      <LogoutConfirmModal
        isOpen={showLogoutModal}
        onCancel={() => setShowLogoutModal(false)}
        onConfirm={() => {
          setShowLogoutModal(false);
          handleLogout();
        }}
      />
    </Box>
  );
}