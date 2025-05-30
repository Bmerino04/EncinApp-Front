import React, { useState } from 'react';
import { Box, Button, Center, Checkbox, FormControl, Icon, Input, Text, VStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../../navigation/types';
import { MaterialIcons } from '@expo/vector-icons';

const LoginSchema = Yup.object().shape({
  rut: Yup.string().required('El rut es requerido'),
  pin: Yup.string().required('El pin es requerido'),
});

type NavigationProp = NativeStackNavigationProp<any, any>;

export function LoginScreen() {
  const navigation = useNavigation<NavigationProp>();
  const [showPin, setShowPin] = useState(false);

  const handleLogin = (values: { rut: string; pin: string; remember: boolean }) => {
    // Mock login logic
    setTimeout(() => {
      navigation.reset({ index: 0, routes: [{ name: 'Main' }] });
    }, 500);
  };

  return (
    <Box flex={1} bg={{
      linearGradient: {
        colors: ['#a18cd1', '#fbc2eb'],
        start: [0, 0],
        end: [1, 1],
      },
    }}>
      <Center flex={1} px={6}>
        <Box w="100%" maxW="350" bg="white" opacity={0.9} borderRadius={20} p={6} shadow={4}>
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
                  <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>Rut</FormControl.Label>
                  <Input
                    placeholder="Ingresa tu rut…"
                    fontFamily="Geist"
                    value={values.rut}
                    onChangeText={handleChange('rut')}
                    onBlur={handleBlur('rut')}
                    autoCapitalize="none"
                    bg="white"
                  />
                  <FormControl.ErrorMessage>{errors.rut}</FormControl.ErrorMessage>
                </FormControl>
                <FormControl isInvalid={!!(touched.pin && errors.pin)}>
                  <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>Pin</FormControl.Label>
                  <Input
                    placeholder="Ingresa tu Pin…"
                    fontFamily="Geist"
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
                  _text={{ fontFamily: 'Geist', fontWeight: '400', fontSize: 'sm' }}
                >
                  Recuerda mi sesión
                </Checkbox>
                <Button
                  mt={2}
                  w="100%"
                  bg="primary"
                  _text={{ fontFamily: 'Geist', fontWeight: '600', fontSize: 'md' }}
                  borderRadius={12}
                  onPress={handleSubmit as any}
                >
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