import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Button, Text, TextInput, Checkbox } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from 'src/navigation/types';
import { LinearGradient } from 'expo-linear-gradient';
import { api } from 'src/api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginSchema = Yup.object().shape({
  rut: Yup.string().required('El rut es requerido'),
  pin: Yup.string().required('El pin es requerido'),
});

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Login'>;

interface LoginScreenProps {
  onLogin: () => void;
}

export function LoginScreen({ onLogin }: LoginScreenProps) {
  const navigation = useNavigation<NavigationProp>();
  const [showPin, setShowPin] = useState(false);

  const handleLogin = async (values: { rut: string; pin: string; remember: boolean }) => {
    console.log('[Login] Iniciando sesión con:', values);

    try {
      console.log('[Login] Enviando petición a API…');
      const response = await api.post('/auth/login', {
        rut: values.rut,
        pin: values.pin,
      });

      console.log('[Login] Respuesta recibida:', response.data);

      const token = response.data.token;
      await AsyncStorage.setItem('userToken', token);

      console.log('[Login] Token guardado en AsyncStorage');

      onLogin();
    } catch (error: any) {
      console.error('[Login] Error en login:', error);

      if (error.response) {
        console.error('[Login] Error response:', error.response.data);
      } else if (error.request) {
        console.error('[Login] No se recibió respuesta. Detalles del request:', error.request);
      } else {
        console.error('[Login] Error al configurar la petición:', error.message);
      }

      if (error.response?.status === 404) {
        Alert.alert('Credenciales incorrectas', 'El rut o pin ingresado es incorrecto.');
      } else {
        Alert.alert('Error al iniciar sesión', error.response?.data?.message || 'Error desconocido');
      }
    }
  };

  return (
    <LinearGradient
      colors={['#a18cd1', '#fbc2eb']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.title}>Iniciar Sesión</Text>
          <Formik
            initialValues={{ rut: '', pin: '', remember: false }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.form}>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Rut</Text>
                  <TextInput
                    mode="outlined"
                    placeholder="Ingresa tu rut…"
                    value={values.rut}
                    onChangeText={handleChange('rut')}
                    onBlur={handleBlur('rut')}
                    autoCapitalize="none"
                    style={styles.input}
                    outlineStyle={[
                      styles.inputOutline,
                      touched.rut && errors.rut && styles.inputError
                    ]}
                    error={!!(touched.rut && errors.rut)}
                  />
                  {touched.rut && errors.rut && (
                    <Text style={styles.errorText}>{errors.rut}</Text>
                  )}
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Pin</Text>
                  <TextInput
                    mode="outlined"
                    placeholder="Ingresa tu Pin…"
                    value={values.pin}
                    onChangeText={handleChange('pin')}
                    onBlur={handleBlur('pin')}
                    autoCapitalize="none"
                    secureTextEntry={!showPin}
                    style={styles.input}
                    outlineStyle={[
                      styles.inputOutline,
                      touched.pin && errors.pin && styles.inputError
                    ]}
                    error={!!(touched.pin && errors.pin)}
                  />
                  {touched.pin && errors.pin && (
                    <Text style={styles.errorText}>{errors.pin}</Text>
                  )}
                </View>

                <Checkbox.Item
                  label="Recuerda mi sesión"
                  status={values.remember ? 'checked' : 'unchecked'}
                  onPress={() => setFieldValue('remember', !values.remember)}
                  style={styles.checkbox}
                />

                <Button
                  mode="contained"
                  onPress={handleSubmit as any}
                  style={styles.button}
                  labelStyle={styles.buttonText}
                >
                  Iniciar Sesión
                </Button>
              </View>
            )}
          </Formik>
        </View>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  card: {
    width: '100%',
    maxWidth: 350,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    opacity: 0.9,
  },
  title: {
    fontFamily: 'Geist-Bold',
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    marginBottom: 8,
  },
  label: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    fontFamily: 'Geist',
    fontSize: 16,
  },
  inputOutline: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#bcc0cc',
  },
  inputError: {
    borderColor: '#d20f39',
  },
  errorText: {
    color: '#d20f39',
    fontSize: 12,
    marginTop: 4,
  },
  checkbox: {
    paddingHorizontal: 0,
  },
  button: {
    marginTop: 8,
    borderRadius: 8,
    backgroundColor: '#4f46e5',
  },
  buttonText: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 16,
  },
}); 