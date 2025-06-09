import React, { useState } from 'react';
import { Alert, TextInput } from 'react-native';
import { Box, Button, FormControl, IconButton, Icon, StatusBar, Spinner, Center, VStack, Text } from 'native-base';
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
    <Box flex={1} bg="#f5f6fa">
      <StatusBar barStyle="dark-content" />
      <Box safeAreaTop bg="#f5f6fa" />
      <Box
        flexDirection="row"
        alignItems="center"
        bg="white"
        borderRadius={16}
        mx={3}
        mt={3}
        mb={6}
        px={2}
        py={2}
        shadow={1}
      >
        <IconButton
          icon={<Icon as={MaterialIcons} name="arrow-back-ios" size={5} color="primary" />}
          borderRadius="full"
          variant="ghost"
          onPress={() => navigation.goBack()}
        />
        <Text
          fontFamily="Geist"
          fontWeight="600"
          fontSize="lg"
          color="primary"
          flex={1}
          textAlign="center"
          mr={7}
        >
          Añadir Vecino
        </Text>
      </Box>

      {/* Si estamos enviando la petición, mostramos un loader */}
      {submitting ? (
        <Center flex={1}>
          <Spinner size="lg" />
        </Center>
      ) : (
        <Formik
          initialValues={{ nombre: '', rut: '', pin: '', confirmPin: '' }}
          validationSchema={RegisterSchema}
          onSubmit={handleRegister}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
            <VStack space={4} px={6}>
              <FormControl isInvalid={!!(touched.nombre && errors.nombre)}>
                <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                  Nombre de usuario
                </FormControl.Label>
                <TextInput
                  placeholder="Ingresa el nombre de usuario"
                  value={values.nombre}
                  onChangeText={handleChange('nombre')}
                  onBlur={handleBlur('nombre')}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 8,
                    padding: 12,
                  }}
                />
                <FormControl.ErrorMessage>{errors.nombre}</FormControl.ErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!(touched.rut && errors.rut)}>
                <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                  Rut
                </FormControl.Label>
                <TextInput
                  placeholder="Ej: 12345678-9"
                  value={values.rut}
                  onChangeText={handleChange('rut')}
                  onBlur={handleBlur('rut')}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 8,
                    padding: 12,
                  }}
                />
                <FormControl.ErrorMessage>{errors.rut}</FormControl.ErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!(touched.pin && errors.pin)}>
                <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                  Pin
                </FormControl.Label>
                <TextInput
                  placeholder="Ingresa el pin"
                  value={values.pin}
                  onChangeText={handleChange('pin')}
                  onBlur={handleBlur('pin')}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 8,
                    padding: 12,
                  }}
                  secureTextEntry={!showPin}
                />
                <FormControl.ErrorMessage>{errors.pin}</FormControl.ErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!(touched.confirmPin && errors.confirmPin)}>
                <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                  Confirmar Pin
                </FormControl.Label>
                <TextInput
                  placeholder="Confirma el pin"
                  value={values.confirmPin}
                  onChangeText={handleChange('confirmPin')}
                  onBlur={handleBlur('confirmPin')}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: 8,
                    padding: 12,
                  }}
                  secureTextEntry={!showConfirmPin}
                />
                <FormControl.ErrorMessage>{errors.confirmPin}</FormControl.ErrorMessage>
              </FormControl>

              <Button
                mt={4}
                w="100%"
                bg="#7f9cf5"
                _text={{ fontFamily: 'Geist', fontWeight: '600', fontSize: 'md' }}
                borderRadius={12}
                onPress={handleSubmit as any}
              >
                Registrar
              </Button>
            </VStack>
          )}
        </Formik>
      )}
    </Box>
  );
}