import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  Text,
  VStack,
  IconButton,
  Icon,
  StatusBar,
  useToast,
} from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainStackParamList } from 'src/navigation/types';
import { api } from 'src/api/axios';
import { TextInput } from 'react-native';

type EditUserPinRoute = RouteProp<MainStackParamList, 'EditUserPin'>;

const PinSchema = Yup.object().shape({
  newPin: Yup.string().required('El nuevo pin es requerido').min(4, 'Mínimo 4 dígitos'),
  repeatPin: Yup.string()
    .oneOf([Yup.ref('newPin')], 'Los pines no coinciden')
    .required('Repite el nuevo pin'),
});

export function EditUserPinScreen() {
  const navigation = useNavigation();
  const toast = useToast();
  const route = useRoute<EditUserPinRoute>();
  const { id } = route.params;
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);

  const handleSave = async (values: { newPin: string }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        toast.show({ description: 'Token no encontrado, por favor inicia sesión' });
        return;
      }
      const body = { pin: values.newPin };
      await api.patch(`/usuarios/${id}`, body, {
        headers: { Authorization: token },
      });
      toast.show({ description: 'Pin actualizado correctamente' });
      navigation.goBack();
    } catch (error) {
      console.error(error);
      toast.show({ description: 'Error actualizando pin' });
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
          Cambiar pin
        </Text>
      </Box>
      <Formik
        initialValues={{ newPin: '', repeatPin: '' }}
        validationSchema={PinSchema}
        onSubmit={(values) => handleSave({ newPin: values.newPin })}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <VStack space={4} px={6} mt={2}>
            <FormControl isInvalid={!!(touched.newPin && errors.newPin)}>
              <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                Nuevo Pin
              </FormControl.Label>
              <TextInput
                placeholder="****"
                style={{
                  backgroundColor: 'white',
                  borderRadius: 8,
                  padding: 12,
                  fontFamily: 'Geist',
                }}
                value={values.newPin}
                onChangeText={handleChange('newPin')}
                onBlur={handleBlur('newPin')}
                secureTextEntry={!showNew}
              />
              <FormControl.ErrorMessage>{errors.newPin}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!(touched.repeatPin && errors.repeatPin)}>
              <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                Repetir nuevo Pin
              </FormControl.Label>
              <TextInput
                placeholder="****"
                style={{
                  backgroundColor: 'white',
                  borderRadius: 8,
                  padding: 12,
                  fontFamily: 'Geist',
                }}
                value={values.repeatPin}
                onChangeText={handleChange('repeatPin')}
                onBlur={handleBlur('repeatPin')}
                secureTextEntry={!showRepeat}
              />
              <FormControl.ErrorMessage>{errors.repeatPin}</FormControl.ErrorMessage>
            </FormControl>

            <Button
              mt={4}
              w="100%"
              bg="#7f9cf5"
              _text={{ fontFamily: 'Geist', fontWeight: '600', fontSize: 'md' }}
              borderRadius={12}
              onPress={handleSubmit as any}
            >
              Guardar
            </Button>
          </VStack>
        )}
      </Formik>
    </Box>
  );
}