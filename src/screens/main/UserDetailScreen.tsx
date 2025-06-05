import React from 'react';
import { Box, Text, IconButton, Icon, StatusBar, VStack, Divider, Pressable } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from 'src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

const mockUsers = [
  { id: 1, nombre: 'Bernardino Jara', rut: '12.345.677-9', direccion: 'Santa Carolina 125', pin: '', disponibilidad: false, permisos: [] },
  { id: 2, nombre: 'José Soto', rut: '11.222.333-4', direccion: 'Av. Encinas 0472', pin: '', disponibilidad: true, permisos: [] },
];

type UserDetailRouteProp = RouteProp<MainStackParamList, 'UserDetail'>;

export function UserDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<UserDetailRouteProp>();
  const { id } = route.params;
  const user = mockUsers.find(u => u.id === Number(id));

  if (!user) {
    return (
      <Box flex={1} alignItems="center" justifyContent="center">
        <Text>No se encontró el usuario.</Text>
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
          {/* Device field blank for now */}
        </Text>
      </VStack>
      <Box bg="white" borderRadius={20} shadow={2} mx={3}>
        <VStack divider={<Divider />}>
          <Pressable onPress={() => navigation.navigate('EditUserName', { id: String(user.id), value: user.nombre })}>
            <Box px={5} py={4}><Text fontFamily="Geist" fontWeight="400" fontSize="md">Cambiar Nombre</Text></Box>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('EditUserAddress', { id: String(user.id), value: user.direccion })}>
            <Box px={5} py={4}><Text fontFamily="Geist" fontWeight="400" fontSize="md">Cambiar Dirección</Text></Box>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('EditUserPin', { id: String(user.id) })}>
            <Box px={5} py={4}><Text fontFamily="Geist" fontWeight="400" fontSize="md">Cambiar Pin</Text></Box>
          </Pressable>
          <Pressable onPress={() => navigation.navigate('EditUserRut', { id: String(user.id), value: user.rut })}>
            <Box px={5} py={4}><Text fontFamily="Geist" fontWeight="400" fontSize="md">Cambiar Rut</Text></Box>
          </Pressable>
          <Pressable><Box px={5} py={4}><Text fontFamily="Geist" fontWeight="400" fontSize="md">Gestionar Permisos</Text></Box></Pressable>
          <Pressable><Box px={5} py={4}><Text fontFamily="Geist" fontWeight="400" fontSize="md">Transferir Presidencia</Text></Box></Pressable>
          <Pressable><Box px={5} py={4}><Text fontFamily="Geist" fontWeight="400" fontSize="md">Eliminar Cuenta</Text></Box></Pressable>
        </VStack>
      </Box>
    </Box>
  );
} 