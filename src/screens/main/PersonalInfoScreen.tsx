import React, { useState } from 'react';
import { Box, Text, IconButton, Icon, StatusBar, VStack, Divider, Pressable, Switch, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons } from '@expo/vector-icons';

const mockUser = {
  nombre: 'Admin_Presidente',
  rut: '12.345.677-9',
  direccion: 'Santa Carolina 125',
  disponibilidad: true,
};

export function PersonalInfoScreen() {
  const navigation = useNavigation();
  const [disponibilidad, setDisponibilidad] = useState(mockUser.disponibilidad);

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
          {mockUser.nombre}
        </Text>
        <Text fontFamily="Geist" fontWeight="400" fontSize="md" color="muted.500">
          {mockUser.rut}
        </Text>
        <Text fontFamily="Geist" fontWeight="400" fontSize="md" color="muted.400">
          {mockUser.direccion}
        </Text>
      </VStack>
      <Box bg="white" borderRadius={20} shadow={2} mx={3}>
        <VStack divider={<Divider />}>
          <HStack alignItems="center" justifyContent="space-between" px={5} py={4}>
            <Text fontFamily="Geist" fontWeight="400" fontSize="md">Disponibilidad</Text>
            <Switch
              isChecked={disponibilidad}
              onToggle={() => setDisponibilidad(!disponibilidad)}
              offTrackColor="muted.300"
              onTrackColor="primary.400"
            />
          </HStack>
          <Pressable><Box px={5} py={4}><Text fontFamily="Geist" fontWeight="400" fontSize="md">Cambiar nombre de usuario</Text></Box></Pressable>
          <Pressable><Box px={5} py={4}><Text fontFamily="Geist" fontWeight="400" fontSize="md">Cambiar Dirección</Text></Box></Pressable>
          <Pressable><Box px={5} py={4}><Text fontFamily="Geist" fontWeight="400" fontSize="md">Cambiar pin</Text></Box></Pressable>
          <Pressable><Box px={5} py={4}><Text fontFamily="Geist" fontWeight="400" fontSize="md">Cerrar sesión</Text></Box></Pressable>
        </VStack>
      </Box>
    </Box>
  );
} 