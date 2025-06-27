import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {
  Button,
  Text,
  Checkbox,
  useTheme,
} from 'react-native-paper';
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
  const theme = useTheme();
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
          // Note: We'll need to implement a toast alternative
        }
      } finally {
        setLoadingFetch(false);
      }
    };

    fetchPermisos();
  }, [isOpen, idUsuario]);

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

      // Note: We'll need to implement a toast alternative
      onClose();
    } catch (error: any) {
      console.error('Error al actualizar permisos:', error.response?.data || error.message);
      // Note: We'll need to implement a toast alternative
    } finally {
      setSaving(false);
    }
  };

  const handlePermissionToggle = (value: string) => {
    setSelected(prev => 
      prev.includes(value) 
        ? prev.filter(p => p !== value)
        : [...prev, value]
    );
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.body}>
            <Text style={styles.title}>
              Asigna los permisos para este vecino
            </Text>
            <Text style={styles.subtitle}>
              Selecciona las funcionalidades a las que este vecino tendrá acceso. Puedes activar
              o desactivar permisos en cualquier momento.
            </Text>

            {loadingFetch ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            ) : (
              <View style={styles.permissionsContainer}>
                {PERMISSIONS.map((p) => (
                  <Checkbox.Item
                    key={p.value}
                    label={p.label}
                    status={selected.includes(p.value) ? 'checked' : 'unchecked'}
                    onPress={() => handlePermissionToggle(p.value)}
                    style={styles.checkbox}
                    labelStyle={styles.checkboxLabel}
                  />
                ))}
              </View>
            )}

            <View style={styles.buttonContainer}>
              <Button
                mode="text"
                onPress={onClose}
                style={styles.cancelButton}
                labelStyle={styles.cancelButtonText}
                disabled={saving}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleSave}
                style={styles.saveButton}
                labelStyle={styles.saveButtonText}
                loading={saving}
              >
                Guardar
              </Button>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    backgroundColor: 'white',
    borderRadius: 16,
    margin: 20,
    maxWidth: '90%',
    width: '100%',
  },
  body: {
    padding: 24,
    alignItems: 'center',
    gap: 12,
  },
  title: {
    fontFamily: 'Geist',
    fontWeight: '700',
    fontSize: 18,
    textAlign: 'center',
  },
  subtitle: {
    fontFamily: 'Geist',
    fontWeight: '400',
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  loadingContainer: {
    width: '100%',
    paddingVertical: 24,
    alignItems: 'center',
  },
  permissionsContainer: {
    width: '100%',
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingVertical: 8,
  },
  checkbox: {
    paddingHorizontal: 8,
  },
  checkboxLabel: {
    fontFamily: 'Geist',
    fontWeight: '500',
    fontSize: 16,
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    borderRadius: 8,
  },
  cancelButtonText: {
    fontFamily: 'Geist',
    fontWeight: '500',
    color: '#3b82f6',
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#7f9cf5',
  },
  saveButtonText: {
    fontFamily: 'Geist',
    fontWeight: '600',
  },
}); 