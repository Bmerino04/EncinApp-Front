import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
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
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.card}>
        <View style={styles.content}>
          <View style={styles.avatar}>
            <MaterialIcons name="person" size={28} color="#9ca3af" />
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.name}>
              {user.nombre}
            </Text>
            {user.disponibilidad ? (
              <View style={styles.statusContainer}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>
                  en casa
                </Text>
              </View>
            ) : (
              <Text style={styles.unavailableText}>
                No disponible
              </Text>
            )}
          </View>
          <MaterialIcons name="chevron-right" size={24} color="#9ca3af" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 16,
    marginBottom: 12,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 1,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    backgroundColor: '#e5e7eb',
    borderRadius: 999,
    padding: 8,
  },
  userInfo: {
    flex: 1,
  },
  name: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 16,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#10b981',
  },
  statusText: {
    fontFamily: 'Geist',
    fontWeight: '400',
    fontSize: 14,
    color: '#6b7280',
  },
  unavailableText: {
    fontFamily: 'Geist',
    fontWeight: '400',
    fontSize: 14,
    color: '#9ca3af',
  },
}); 