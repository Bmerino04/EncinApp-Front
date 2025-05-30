import React from 'react';
import { Box, HStack, VStack, Text, Icon, Pressable } from 'native-base';
import { MaterialIcons } from '@expo/vector-icons';

export interface User {
  id: number;
  nombre: string;
  rut: string;
  direccion: string;
  pin: string;
  disponibilidad: boolean;
  permisos: any[];
}

interface UserListItemProps {
  user: User;
  onPress?: () => void;
}

export function UserListItem({ user, onPress }: UserListItemProps) {
  return (
    <Pressable onPress={onPress} borderRadius={16} mb={3}>
      <Box bg="white" borderRadius={16} px={4} py={3} shadow={1}>
        <HStack alignItems="center" space={3}>
          <Box bg="muted.200" borderRadius={999} p={2}>
            <Icon as={MaterialIcons} name="person" size={7} color="muted.400" />
          </Box>
          <VStack flex={1}>
            <Text fontFamily="Geist" fontWeight="600" fontSize="md">
              {user.nombre}
            </Text>
            {user.disponibilidad ? (
              <HStack alignItems="center" space={1}>
                <Box w={2} h={2} borderRadius={999} bg="green.500" />
                <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.600">
                  en casa
                </Text>
              </HStack>
            ) : (
              <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.400">
                No disponible
              </Text>
            )}
          </VStack>
          <Icon as={MaterialIcons} name="chevron-right" size={6} color="muted.400" />
        </HStack>
      </Box>
    </Pressable>
  );
} 