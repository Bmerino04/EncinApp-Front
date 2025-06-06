import React, { useState } from 'react';
import { Alert, StyleSheet } from 'react-native';
import {
  Box,
  Button,
  Center,
  Checkbox,
  FormControl,
  Icon,
  Input,
  Text,
  VStack,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from 'src/navigation/types';
import { MaterialIcons } from '@expo/vector-icons';
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
    try {
      const response = await api.post('/auth/login', {
        rut: values.rut,
        pin: values.pin,
      });

      const token = response.data.token;
      await AsyncStorage.setItem('userToken', token);

      onLogin();
    } catch (error: any) {
      console.error('Error en login:', error.response?.data || error.message);
      if (error.response?.status === 404) {
        Alert.alert('Credenciales incorrectas', 'El rut o pin ingresado es incorrecto.');
      } else {
        Alert.alert('Error al iniciar sesión', error.response?.data?.message || 'Error desconocido');
      }
    }
  };

  return (
    <Box
      flex={1}
      bg={{
        linearGradient: {
          colors: ['#a18cd1', '#fbc2eb'],
          start: [0, 0],
          end: [1, 1],
        },
      }}
    >
      <Center flex={1} px={6}>
        <Box
          w="100%"
          maxW="350"
          bg="white"
          borderRadius={20}
          p={6}
          shadow={4}
          style={styles.boxOpacity}
        >
          <Text fontFamily="Geist" fontWeight="700" fontSize="2xl" textAlign="center" mb={6}>
            Iniciar Sesión
          </Text>
          <Formik
            initialValues={{ rut: '', pin: '', remember: false }}
            validationSchema={LoginSchema}
            onSubmit={handleLogin}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <VStack space={4}>
                <FormControl isInvalid={!!(touched.rut && errors.rut)}>
                  <FormControl.Label>Rut</FormControl.Label>
                  <Input
                    placeholder="Ingresa tu rut…"
                    value={values.rut}
                    onChangeText={handleChange('rut')}
                    onBlur={handleBlur('rut')}
                    autoCapitalize="none"
                    bg="white"
                  />
                  <FormControl.ErrorMessage>{errors.rut}</FormControl.ErrorMessage>
                </FormControl>

                <FormControl isInvalid={!!(touched.pin && errors.pin)}>
                  <FormControl.Label>Pin</FormControl.Label>
                  <Input
                    placeholder="Ingresa tu Pin…"
                    value={values.pin}
                    onChangeText={handleChange('pin')}
                    onBlur={handleBlur('pin')}
                    type={showPin ? 'text' : 'password'}
                    autoCapitalize="none"
                    bg="white"
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

                <Checkbox
                  value="remember"
                  isChecked={values.remember}
                  onChange={v => setFieldValue('remember', v)}
                >
                  Recuerda mi sesión
                </Checkbox>

                <Button mt={2} onPress={handleSubmit as any}>
                  Iniciar Sesión
                </Button>
              </VStack>
            )}
          </Formik>
        </Box>
      </Center>
    </Box>
  );
}

const styles = StyleSheet.create({
  boxOpacity: {
    opacity: 0.9,
  },
}); 