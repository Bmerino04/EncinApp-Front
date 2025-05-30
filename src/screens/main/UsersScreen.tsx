import React from 'react';
import { Box, Text, IconButton, Icon, StatusBar } from 'native-base';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserListItem, User } from 'src/components/common/UserListItem';

const mockUsers: User[] = [
  { id: 1, nombre: 'Bernardino Jara', rut: '', direccion: '', pin: '', disponibilidad: false, permisos: [] },
  { id: 2, nombre: 'José Soto', rut: '', direccion: '', pin: '', disponibilidad: true, permisos: [] },
  { id: 3, nombre: 'Felipe Jorquera', rut: '', direccion: '', pin: '', disponibilidad: false, permisos: [] },
  { id: 4, nombre: 'Juan Pablo Uribe', rut: '', direccion: '', pin: '', disponibilidad: true, permisos: [] },
  { id: 5, nombre: 'Aurora Ganga', rut: '', direccion: '', pin: '', disponibilidad: true, permisos: [] },
  { id: 6, nombre: 'Melisa Sandoval', rut: '', direccion: '', pin: '', disponibilidad: true, permisos: [] },
  { id: 7, nombre: 'Cristobal Sepulveda', rut: '', direccion: '', pin: '', disponibilidad: false, permisos: [] },
];

export function UsersScreen() {
  const navigation = useNavigation();

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
        mb={2}
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
          Vecinos
        </Text>
        <IconButton
          icon={<Icon as={MaterialCommunityIcons} name="account-plus-outline" size={6} color="muted.500" />}
          borderRadius="full"
          variant="ghost"
          onPress={() => {}}
        />
      </Box>
      <FlatList
        data={mockUsers}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <UserListItem user={item} onPress={() => {}} />}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
} 