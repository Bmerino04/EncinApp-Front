import React from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';

interface TransferPresidencyModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
  userName: string;
}

export function TransferPresidencyModal({ isOpen, onCancel, onConfirm, userName }: TransferPresidencyModalProps) {
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
              ¿Estás seguro de transferir tu presidencia?
            </Text>
            <Text style={styles.subtitle}>
              Al confirmar, {userName} asumirá todas las funcionalidades de presidente y perderás los permisos asociados a este título.
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
                style={styles.confirmButton}
                labelStyle={styles.confirmButtonText}
              >
                Confirmar
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
  confirmButton: {
    flex: 1,
    marginLeft: 8,
    borderRadius: 8,
    backgroundColor: '#ef4444',
  },
  confirmButtonText: {
    fontFamily: 'Geist',
    fontWeight: '600',
  },
}); 