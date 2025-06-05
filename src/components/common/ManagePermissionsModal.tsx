import React, { useState, useEffect } from 'react';
import { Modal, Button, Text, VStack, Checkbox, Box, HStack } from 'native-base';

const PERMISSIONS = [
  { label: 'Gestionar Anuncios', value: 'anuncios' },
  { label: 'Gestionar Vecinos', value: 'vecinos' },
  { label: 'Gestionar Puntos', value: 'puntos' },
  { label: 'Gestionar Permisos', value: 'permisos' },
];

interface ManagePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPermissions: string[];
  onSave: (perms: string[]) => void;
}

export function ManagePermissionsModal({ isOpen, onClose, currentPermissions, onSave }: ManagePermissionsModalProps) {
  const [selected, setSelected] = useState<string[]>(currentPermissions);

  useEffect(() => {
    setSelected(currentPermissions);
  }, [currentPermissions, isOpen]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} avoidKeyboard>
      <Modal.Content borderRadius={16} maxW="90%">
        <Modal.Body>
          <VStack space={3} alignItems="center">
            <Text fontFamily="Geist" fontWeight="700" fontSize="lg" textAlign="center">
              Asigna los permisos para este vecino
            </Text>
            <Text fontFamily="Geist" fontWeight="400" fontSize="sm" color="muted.600" textAlign="center">
              Selecciona las funcionalidades a las que este vecino tendrá acceso. Puedes activar o desactivar permisos en cualquier momento.
            </Text>
            <Box w="100%" bg="muted.100" borderRadius={12} py={2}>
              <Checkbox.Group
                value={selected}
                onChange={setSelected}
                accessibilityLabel="Selecciona permisos"
              >
                <VStack space={2} px={2}>
                  {PERMISSIONS.map(p => (
                    <Checkbox
                      key={p.value}
                      value={p.value}
                      _text={{ fontFamily: 'Geist', fontWeight: '500', fontSize: 'md' }}
                      borderRadius={8}
                    >
                      {p.label}
                    </Checkbox>
                  ))}
                </VStack>
              </Checkbox.Group>
            </Box>
            <HStack w="100%" justifyContent="space-between" mt={4}>
              <Button
                variant="ghost"
                colorScheme="coolGray"
                borderRadius={8}
                onPress={onClose}
                _text={{ color: 'blue.500', fontFamily: 'Geist', fontWeight: '500' }}
              >
                Cancelar
              </Button>
              <Button
                bg="#7f9cf5"
                borderRadius={8}
                onPress={() => onSave(selected)}
                _text={{ color: 'white', fontFamily: 'Geist', fontWeight: '600' }}
              >
                Guardar
              </Button>
            </HStack>
          </VStack>
        </Modal.Body>
      </Modal.Content>
    </Modal>
  );
} 