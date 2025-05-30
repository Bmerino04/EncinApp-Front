import React from 'react';
import { Modal, Button, Text, VStack } from 'native-base';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({ isOpen, onCancel, onConfirm }: ConfirmDeleteModalProps) {
  return (
    <Modal isOpen={isOpen} onClose={onCancel} avoidKeyboard>
      <Modal.Content borderRadius={16}>
        <Modal.Body>
          <VStack space={4} alignItems="center">
            <Text fontFamily="Geist" fontWeight="600" fontSize="md" textAlign="center">
              ¿Estás seguro de eliminar este anuncio?
            </Text>
            <VStack w="100%" space={2}>
              <Button variant="ghost" colorScheme="primary" onPress={onCancel} borderRadius={8}>
                Cancelar
              </Button>
              <Button colorScheme="danger" onPress={onConfirm} borderRadius={8}>
                Eliminar
              </Button>
            </VStack>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
} 