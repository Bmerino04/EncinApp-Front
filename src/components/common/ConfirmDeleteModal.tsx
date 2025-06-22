import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface ConfirmDeleteModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

export function ConfirmDeleteModal({ isOpen, onCancel, onConfirm }: ConfirmDeleteModalProps) {
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
              ¿Estás seguro de eliminar este anuncio?
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
                onPress={onConfirm}
                style={styles.deleteButton}
                labelStyle={styles.deleteButtonText}
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
    margin: 20,
    maxWidth: 400,
    width: '100%',
  },
  body: {
    padding: 24,
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  buttonContainer: {
    width: '100%',
    gap: 8,
  },
  cancelButton: {
    borderRadius: 8,
  },
  cancelButtonText: {
    fontFamily: 'Geist',
    fontWeight: '500',
    color: '#4f46e5',
  },
  deleteButton: {
    borderRadius: 8,
    backgroundColor: '#d20f39',
  },
  deleteButtonText: {
    fontFamily: 'Geist',
    fontWeight: '500',
  },
}); 