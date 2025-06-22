import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text, Badge } from 'react-native-paper';
import { ReactNode } from 'react';

interface NavButtonProps {
  icon: ReactNode;
  label: string;
  onPress: () => void;
  notificationDot?: boolean;
}

export function NavButton({ icon, label, onPress, notificationDot }: NavButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.button}>
        {notificationDot && (
          <View style={styles.notificationDot} />
        )}
        <View style={styles.content}>
          {icon}
          <Text style={styles.label}>{label}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '44%',
    marginBottom: 16,
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    height: 112,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  notificationDot: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#d20f39',
  },
  content: {
    alignItems: 'center',
    gap: 8,
  },
  label: {
    fontFamily: 'Geist',
    fontWeight: '500',
    fontSize: 16,
    color: '#4f46e5',
  },
}); 