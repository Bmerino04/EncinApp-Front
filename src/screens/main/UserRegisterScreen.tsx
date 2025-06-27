import React, { useState } from 'react';
import { Alert, TextInput, View, StyleSheet, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Button, HelperText, ActivityIndicator } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/api/axios';

const RegisterSchema = Yup.object().shape({
  nombre: Yup.string().required('El nombre es requerido'),
  rut: Yup.string().required('El rut es requerido'),
  pin: Yup.string().required('El pin es requerido').min(4, 'Mínimo 4 dígitos'),
  confirmPin: Yup.string()
    .oneOf([Yup.ref('pin')], 'Los pines no coinciden')
    .required('Confirma el pin'),
});

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'UserRegister'>;

export function UserRegisterScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [showPin, setShowPin] = useState(false);
  const [showConfirmPin, setShowConfirmPin] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const handleRegister = async (values: {
    nombre: string;
    rut: string;
    pin: string;
    confirmPin: string;
  }) => {
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('userToken');

      if (!token) {
        Alert.alert('Error de autenticación', 'No se ha encontrado el token.');
        setSubmitting(false);
        return;
      }

      const payload = {
        nombre: values.nombre,
        rut: values.rut,
        pin: values.pin,
        es_presidente: false,
        disponibilidad: false,
        direccion: '',
      };

      await api.post('/usuarios', payload, {
        headers: {
          Authorization: token,
        },
      });

      navigation.goBack();
    } catch (error: any) {
      console.error('Error en registro:', error.response?.data || error.message);
      const mensaje = error.response?.data?.message || 'No se pudo registrar el usuario.';
      Alert.alert('Error al registrar', mensaje);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Añadir Vecino</Text>
        <View style={{ width: 28 }} />
      </View>
      {submitting ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <Formik
          initialValues={{ nombre: '', rut: '', pin: '', confirmPin: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <View style={styles.form}>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Nombre de usuario</Text>
                <TextInput
                  placeholder="Ingresa el nombre de usuario"
                  value={values.nombre}
                  onChangeText={handleChange('nombre')}
                  onBlur={handleBlur('nombre')}
                  style={styles.input}
                />
                <HelperText type="error" visible={!!(touched.nombre && errors.nombre)}>
                  {errors.nombre}
                </HelperText>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Rut</Text>
                <TextInput
                  placeholder="Ej: 12345678-9"
                  value={values.rut}
                  onChangeText={handleChange('rut')}
                  onBlur={handleBlur('rut')}
                  style={styles.input}
                />
                <HelperText type="error" visible={!!(touched.rut && errors.rut)}>
                  {errors.rut}
                </HelperText>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Pin</Text>
                <TextInput
                  placeholder="Ingresa el pin"
                  value={values.pin}
                  onChangeText={handleChange('pin')}
                  onBlur={handleBlur('pin')}
                  style={styles.input}
                  secureTextEntry={!showPin}
                  keyboardType="numeric"
                  maxLength={6}
                />
                <HelperText type="error" visible={!!(touched.pin && errors.pin)}>
                  {errors.pin}
                </HelperText>
              </View>
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirmar Pin</Text>
                <TextInput
                  placeholder="Confirma el pin"
                  value={values.confirmPin}
                  onChangeText={handleChange('confirmPin')}
                  onBlur={handleBlur('confirmPin')}
                  style={styles.input}
                  secureTextEntry={!showConfirmPin}
                  keyboardType="numeric"
                  maxLength={6}
                />
                <HelperText type="error" visible={!!(touched.confirmPin && errors.confirmPin)}>
                  {errors.confirmPin}
                </HelperText>
              </View>
              <Button
                mode="contained"
                onPress={handleSubmit as any}
                style={styles.saveButton}
                labelStyle={styles.saveButtonText}
              >
                Guardar
              </Button>
            </View>
          )}
        </Formik>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 24,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 1,
  },
  backButton: {
    borderRadius: 999,
    padding: 4,
  },
  headerTitle: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 18,
    color: '#4f46e5',
    flex: 1,
    textAlign: 'center',
    marginRight: 28,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  form: {
    paddingHorizontal: 24,
    marginTop: 8,
    gap: 16,
  },
  inputGroup: {
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Geist',
    fontWeight: '500',
    marginBottom: 4,
  },
  input: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 12,
    fontFamily: 'Geist',
    fontSize: 16,
  },
  saveButton: {
    marginTop: 16,
    borderRadius: 12,
    backgroundColor: '#7f9cf5',
  },
  saveButtonText: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 16,
  },
});