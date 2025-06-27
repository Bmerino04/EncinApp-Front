import React, { useState } from 'react';
import { View, StyleSheet, TextInput, KeyboardAvoidingView, Platform, Alert, ScrollView } from 'react-native';
import { Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { api } from 'src/api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const POI_TYPES = [
  { label: 'Salud', value: 'salud' },
  { label: 'Seguridad', value: 'seguridad' },
  { label: 'Siniestro', value: 'siniestro' },
];

export function CreatePOIScreen() {
  const navigation = useNavigation();
  const [tipo, setTipo] = useState('salud');
  const [nombre, setNombre] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');
  const [contacto, setContacto] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!nombre || !latitud || !longitud || !contacto) {
      Alert.alert('Error', 'Por favor completa todos los campos.');
      return;
    }
    setSubmitting(true);
    try {
      const data = {
        tipo,
        nombre,
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
        contacto,
      };
      console.log('POI CREATE DATA:', data);
      const token = await AsyncStorage.getItem('userToken');
      await api.post('/puntos-interes', data, {
        headers: { Authorization: token }
      });
      Alert.alert('Éxito', 'Punto de interés creado correctamente.');
      navigation.goBack();
    } catch (e) {
      console.log('POI CREATE ERROR:', e);
      Alert.alert('Error', 'No se pudo crear el punto de interés.');
    }
    setSubmitting(false);
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Crear Punto de Interés</Text>
        <Text style={styles.label}>Tipo</Text>
        <View style={styles.typeRow}>
          {POI_TYPES.map((t) => (
            <Button
              key={t.value}
              mode={tipo === t.value ? 'contained' : 'outlined'}
              style={styles.typeButton}
              onPress={() => setTipo(t.value)}
            >
              {t.label}
            </Button>
          ))}
        </View>
        <Text style={styles.label}>Nombre</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
          placeholder="Nombre"
        />
        <Text style={styles.label}>Latitud</Text>
        <TextInput
          style={styles.input}
          value={latitud}
          onChangeText={setLatitud}
          placeholder="Latitud"
          keyboardType="numeric"
        />
        <Text style={styles.label}>Longitud</Text>
        <TextInput
          style={styles.input}
          value={longitud}
          onChangeText={setLongitud}
          placeholder="Longitud"
          keyboardType="numeric"
        />
        <Text style={styles.label}>Contacto</Text>
        <TextInput
          style={styles.input}
          value={contacto}
          onChangeText={setContacto}
          placeholder="Contacto"
        />
        <Button
          mode="contained"
          style={styles.submitButton}
          onPress={handleSubmit}
          loading={submitting}
          disabled={submitting}
        >
          Crear
        </Button>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#f5f6fa',
  },
  title: {
    fontFamily: 'Geist',
    fontWeight: '700',
    fontSize: 22,
    color: '#4f46e5',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 16,
    color: '#22223b',
    marginTop: 16,
    marginBottom: 4,
  },
  typeRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 8,
  },
  typeButton: {
    flex: 1,
    borderRadius: 8,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Geist',
    fontSize: 16,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  submitButton: {
    marginTop: 24,
    borderRadius: 8,
    backgroundColor: '#4f46e5',
    paddingVertical: 8,
  },
}); 