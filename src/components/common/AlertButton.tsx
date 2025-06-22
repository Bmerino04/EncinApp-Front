import React from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';

interface AlertButtonProps {
  onPress: () => void;
}

export function AlertButton({ onPress }: AlertButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      <View style={styles.button}>
        <View style={styles.content}>
          <MaterialIcons name="warning" size={40} color="#FF2D55" />
          <Text style={styles.text}>Emitir</Text>
          <Text style={styles.text}>Alerta</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    marginTop: 24,
  },
  button: {
    borderRadius: 999,
    borderWidth: 8,
    borderColor: '#FF6A00',
    backgroundColor: 'white',
    width: 144,
    height: 144,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  content: {
    alignItems: 'center',
    gap: 4,
  },
  text: {
    fontFamily: 'Geist',
    fontWeight: '700',
    fontSize: 18,
    color: '#FF2D55',
    textAlign: 'center',
  },
}); 