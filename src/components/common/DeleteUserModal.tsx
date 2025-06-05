import React from 'react';
import { Modal, Button, Text, VStack, HStack } from 'native-base';

interface DeleteUserModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteUserModal({ isOpen, onCancel, onConfirm }: DeleteUserModalProps) {
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
                onPress={onConfirm}
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