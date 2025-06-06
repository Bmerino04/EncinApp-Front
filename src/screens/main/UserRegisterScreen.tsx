import React, { useState } from 'react';
import { Alert } from 'react-native';
import { Box, Button, FormControl, Input, Text, VStack, IconButton, Icon, StatusBar, Spinner, Center } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';
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
      // Construimos el body con los campos requeridos por tu endpoint
      const payload = {
        nombre: values.nombre,
        rut: values.rut,
        pin: values.pin,
        es_presidente: false,    // Valor por defecto
        disponibilidad: false,   // Valor por defecto
        direccion: '',           // Puedes cambiarlo o agregar un campo en el formulario si quieres
      };

      await api.post('/usuarios', payload);

      // Si llega aquí, la petición fue exitosa: volvemos a la pantalla anterior
      navigation.goBack();
    } catch (error: any) {
      console.error('Error en registro:', error.response?.data || error.message);
      // Mostrar alerta genérica o con el mensaje del backend si existe
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
                <Input
                  placeholder="Ingresa el nombre de usuario"
                  fontFamily="Geist"
                  value={values.nombre}
                  onChangeText={handleChange('nombre')}
                  onBlur={handleBlur('nombre')}
                  bg="white"
                  borderRadius={8}
                />
                <FormControl.ErrorMessage>{errors.nombre}</FormControl.ErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!(touched.rut && errors.rut)}>
                <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                  Rut
                </FormControl.Label>
                <Input
                  placeholder="Ej: 12345678-9"
                  fontFamily="Geist"
                  value={values.rut}
                  onChangeText={handleChange('rut')}
                  onBlur={handleBlur('rut')}
                  bg="white"
                  borderRadius={8}
                />
                <FormControl.ErrorMessage>{errors.rut}</FormControl.ErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!(touched.pin && errors.pin)}>
                <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                  Pin
                </FormControl.Label>
                <Input
                  placeholder="Ingresa el pin"
                  fontFamily="Geist"
                  value={values.pin}
                  onChangeText={handleChange('pin')}
                  onBlur={handleBlur('pin')}
                  type={showPin ? 'text' : 'password'}
                  bg="white"
                  borderRadius={8}
                  InputRightElement={
                    <Icon
                      as={<MaterialIcons name={showPin ? 'visibility' : 'visibility-off'} />}
                      size={5}
                      mr="2"
                      color="muted.400"
                      onPress={() => setShowPin(!showPin)}
                    />
                  }
                />
                <FormControl.ErrorMessage>{errors.pin}</FormControl.ErrorMessage>
              </FormControl>

              <FormControl isInvalid={!!(touched.confirmPin && errors.confirmPin)}>
                <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                  Confirmar Pin
                </FormControl.Label>
                <Input
                  placeholder="Confirma el pin"
                  fontFamily="Geist"
                  value={values.confirmPin}
                  onChangeText={handleChange('confirmPin')}
                  onBlur={handleBlur('confirmPin')}
                  type={showConfirmPin ? 'text' : 'password'}
                  bg="white"
                  borderRadius={8}
                  InputRightElement={
                    <Icon
                      as={<MaterialIcons name={showConfirmPin ? 'visibility' : 'visibility-off'} />}
                      size={5}
                      mr="2"
                      color="muted.400"
                      onPress={() => setShowConfirmPin(!showConfirmPin)}
                    />
                  }
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