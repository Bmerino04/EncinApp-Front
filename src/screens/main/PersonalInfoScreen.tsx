import React, { useEffect, useState } from 'react';
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
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { LogoutConfirmModal } from 'src/components/common/LogoutConfirmModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/api/axios';
import { jwtDecode } from 'jwt-decode';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from 'src/navigation/types';

interface UsuarioApi {
  id_usuario: number;
  nombre: string;
  rut: string;
  pin: string;
  es_presidente: boolean;
  disponibilidad: boolean;
  direccion: string;
}

export function PersonalInfoScreen() {
  // Ahora tipamos navigation con RootStackParamList para que "Auth" sea válido en reset()
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [usuario, setUsuario] = useState<UsuarioApi | null>(null);
  const [loading, setLoading] = useState(true);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  useEffect(() => {
    const fetchUsuario = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.error('Token no encontrado');
          return;
        }

        // Decodificar token para obtener el id_usuario
        const decoded: any = jwtDecode(token);
        const id_usuario = decoded.id_usuario;

        const response = await api.get(`/usuarios/${id_usuario}`, {
          headers: { Authorization: token },
        });

        setUsuario(response.data.usuarioEncontrado);
      } catch (error) {
        console.error('Error al obtener datos del usuario:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsuario();
  }, []);

  const toggleDisponibilidad = () => {
    if (usuario) {
      setUsuario({ ...usuario, disponibilidad: !usuario.disponibilidad });
      // Aquí puedes hacer un PUT a /usuarios/{id} para persistir el cambio si es necesario
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
              onToggle={toggleDisponibilidad}
              offTrackColor="muted.300"
              onTrackColor="primary.400"
            />
          </HStack>
          <Pressable>
            <Box px={5} py={4}>
              <Text fontFamily="Geist" fontWeight="400" fontSize="md">
                Cambiar nombre de usuario
              </Text>
            </Box>
          </Pressable>
          <Pressable>
            <Box px={5} py={4}>
              <Text fontFamily="Geist" fontWeight="400" fontSize="md">
                Cambiar Dirección
              </Text>
            </Box>
          </Pressable>
          <Pressable>
            <Box px={5} py={4}>
              <Text fontFamily="Geist" fontWeight="400" fontSize="md">
                Cambiar pin
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
          navigation.reset({ index: 0, routes: [{ name: 'Auth' }] });
        }}
      />
    </Box>
  );
}