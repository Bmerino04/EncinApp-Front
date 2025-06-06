import React, { useState, useEffect } from 'react';
import {
  Modal,
  Button,
  Text,
  VStack,
  Checkbox,
  Box,
  HStack,
  useToast,
  Spinner,
  Center,
} from 'native-base';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/api/axios';

const PERMISSIONS = [
  { label: 'Gestionar Usuarios', value: 'gestionar_usuarios' },
  { label: 'Gestionar Anuncios', value: 'gestionar_anuncios' },
  { label: 'Gestionar Puntos', value: 'gestionar_puntos' },
  { label: 'Gestionar Permisos', value: 'gestionar_permisos' },
];

interface ManagePermissionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  idUsuario: number;
}

export function ManagePermissionsModal({
  isOpen,
  onClose,
  idUsuario,
}: ManagePermissionsModalProps) {
  const toast = useToast();
  const [selected, setSelected] = useState<string[]>([]);
  const [loadingFetch, setLoadingFetch] = useState(false);
  const [saving, setSaving] = useState(false);

  // Al abrir el modal, obtenemos los permisos actuales del usuario
  useEffect(() => {
    if (!isOpen) return;

    const fetchPermisos = async () => {
      setLoadingFetch(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) throw new Error('Token no encontrado');

        const response = await api.get(`/permisos/${idUsuario}`, {
          headers: { Authorization: token },
        });

        // Si se obtienen permisos, extraer los nombres
        const listaPermisos: Array<{ id_permiso: number; nombre: string }> = response.data.permisos;
        const nombres = listaPermisos.map((p) => p.nombre);
        setSelected(nombres);
      } catch (error: any) {
        const mensaje = error.response?.data?.message;

        if (mensaje === 'El usuario no tiene permisos asignados') {
          // Usuario válido, solo que sin permisos aún
          setSelected([]);
        } else {
          console.error('Error al obtener permisos del usuario:', error.response?.data || error.message);
          toast.show({
            description: 'No se pudieron cargar los permisos',
            placement: 'top',
          });
        }
      } finally {
        setLoadingFetch(false);
      }
    };

    fetchPermisos();
  }, [isOpen, idUsuario, toast]);


  const handleSave = async () => {
    setSaving(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token no encontrado');

      // El body debe ser un array de strings con los nombres de permisos
      await api.patch(
        `/permisos/${idUsuario}`,
        selected,
        {
          headers: { Authorization: token },
        }
      );

      toast.show({
        description: 'Permisos actualizados correctamente',
        placement: 'top',
      });
      onClose();
    } catch (error: any) {
      console.error('Error al actualizar permisos:', error.response?.data || error.message);
      toast.show({
        description: 'No se pudieron actualizar los permisos',
        placement: 'top',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} avoidKeyboard>
      <Modal.Content borderRadius={16} maxW="90%">
        <Modal.CloseButton />
        <Modal.Body>
          <VStack space={3} alignItems="center">
            <Text fontFamily="Geist" fontWeight="700" fontSize="lg" textAlign="center">
              Asigna los permisos para este vecino
            </Text>
            <Text
              fontFamily="Geist"
              fontWeight="400"
              fontSize="sm"
              color="muted.600"
              textAlign="center"
            >
              Selecciona las funcionalidades a las que este vecino tendrá acceso. Puedes activar
              o desactivar permisos en cualquier momento.
            </Text>

            {loadingFetch ? (
              <Center w="100%" py={6}>
                <Spinner size="lg" />
              </Center>
            ) : (
              <Box w="100%" bg="muted.100" borderRadius={12} py={2}>
                <Checkbox.Group
                  value={selected}
                  onChange={setSelected}
                  accessibilityLabel="Selecciona permisos"
                >
                  <VStack space={2} px={2}>
                    {PERMISSIONS.map((p) => (
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
            )}

            <HStack w="100%" justifyContent="space-between" mt={4}>
              <Button
                variant="ghost"
                colorScheme="coolGray"
                borderRadius={8}
                onPress={onClose}
                _text={{ color: 'blue.500', fontFamily: 'Geist', fontWeight: '500' }}
                isDisabled={saving}
              >
                Cancelar
              </Button>
              <Button
                bg="#7f9cf5"
                borderRadius={8}
                onPress={handleSave}
                isLoading={saving}
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