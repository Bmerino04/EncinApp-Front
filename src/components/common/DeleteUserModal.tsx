import React, { useState } from 'react';
import { Modal, Button, Text, VStack, HStack, useToast } from 'native-base';
import { api } from 'src/api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface DeleteUserModalProps {
  isOpen: boolean;
  onCancel: () => void;
  idUsuario: number;
}

export function DeleteUserModal({ isOpen, onCancel, idUsuario }: DeleteUserModalProps) {
  const toast = useToast();
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        toast.show({ description: 'Token no encontrado, por favor inicia sesión' });
        setLoading(false);
        return;
      }

      await api.delete(`/usuarios/${idUsuario}`, {
        headers: { Authorization: token },
      });

      toast.show({ description: 'Usuario eliminado correctamente' });
      onCancel(); // cerrar modal
      navigation.goBack(); // regresar pantalla
    } catch (error) {
      console.error(error);
      toast.show({ description: 'Error al eliminar usuario' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onCancel} avoidKeyboard>
      <Modal.Content borderRadius={16} maxW="90%">
        <Modal.Body>
          <VStack space={4} alignItems="center">
            <Text fontFamily="Geist" fontWeight="700" fontSize="lg" textAlign="center">
              ¿Estás seguro de eliminar esta cuenta?
            </Text>
            <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.700" textAlign="center">
              Esta acción no se puede deshacer.
            </Text>
            <HStack w="100%" justifyContent="space-between" mt={2}>
              <Button
                variant="ghost"
                colorScheme="coolGray"
                borderRadius={8}
                onPress={onCancel}
                _text={{ color: 'blue.500', fontFamily: 'Geist', fontWeight: '500' }}
              >
                Cancelar
              </Button>
              <Button
                bg="red.500"
                borderRadius={8}
                onPress={handleDelete}
                isLoading={loading}
                _text={{ color: 'white', fontFamily: 'Geist', fontWeight: '600' }}
              >
                Eliminar
              </Button>
            </HStack>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
}