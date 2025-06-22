import React, { useState } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { api } from 'src/api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

interface DeleteUserModalProps {
  isOpen: boolean;
  onCancel: () => void;
  idUsuario: number;
}

export function DeleteUserModal({ isOpen, onCancel, idUsuario }: DeleteUserModalProps) {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        // Note: We'll need to implement a toast alternative
        setLoading(false);
        return;
      }

      await api.delete(`/usuarios/${idUsuario}`, {
        headers: { Authorization: token },
      });

      // Note: We'll need to implement a toast alternative
      onCancel(); // cerrar modal
      navigation.goBack(); // regresar pantalla
    } catch (error) {
      console.error(error);
      // Note: We'll need to implement a toast alternative
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <View style={styles.body}>
            <Text style={styles.title}>
              ¿Estás seguro de eliminar esta cuenta?
            </Text>
            <Text style={styles.subtitle}>
              Esta acción no se puede deshacer.
            </Text>
            <View style={styles.buttonContainer}>
              <Button
                mode="text"
                onPress={onCancel}
                style={styles.cancelButton}
                labelStyle={styles.cancelButtonText}
              >
                Cancelar
              </Button>
              <Button
                mode="contained"
                onPress={handleDelete}
                style={styles.deleteButton}
                labelStyle={styles.deleteButtonText}
                loading={loading}
              >
                Eliminar
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
    padding: 24,
    margin: 20,
    width: '90%',
    maxWidth: 400,
  },
  body: {
    alignItems: 'center',
    gap: 16,
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
    color: '#374151',
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
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
  deleteButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#ef4444',
  },
  deleteButtonText: {
    fontFamily: 'Geist',
    fontWeight: '600',
  },
});