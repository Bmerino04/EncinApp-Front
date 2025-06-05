import React from 'react';
import { Box, Button, FormControl, Input, Text, VStack, IconButton, Icon, StatusBar } from 'native-base';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import { MainStackParamList } from 'src/navigation/types';

type EditUserFieldRoute =
  | RouteProp<MainStackParamList, 'EditUserName'>
  | RouteProp<MainStackParamList, 'EditUserAddress'>
  | RouteProp<MainStackParamList, 'EditUserRut'>;

const FIELD_CONFIG = {
  EditUserName: {
    label: 'Nombre de usuario nuevo',
    placeholder: 'nombre de usuario',
    validation: Yup.string().required('El nombre es requerido'),
    title: 'Cambiar nombre de usuario',
  },
  EditUserAddress: {
    label: 'Dirección nueva',
    placeholder: 'dirección',
    validation: Yup.string().required('La dirección es requerida'),
    title: 'Cambiar dirección',
  },
  EditUserRut: {
    label: 'Rut nuevo',
    placeholder: 'rut',
    validation: Yup.string().required('El rut es requerido'),
    title: 'Cambiar rut',
  },
};

export function EditUserFieldScreen() {
  const navigation = useNavigation();
  const route = useRoute<EditUserFieldRoute>();
  // @ts-ignore
  const { id, value } = route.params;
  // @ts-ignore
  const routeName = route.name as keyof typeof FIELD_CONFIG;
  const config = FIELD_CONFIG[routeName];

  const validationSchema = Yup.object().shape({
    field: config.validation,
  });

  const handleSave = () => {
    // Mock save logic
    setTimeout(() => {
      navigation.goBack();
    }, 500);
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
          {config.title}
        </Text>
      </Box>
      <Formik
        initialValues={{ field: value || '' }}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <VStack space={6} px={6} mt={8}>
            <FormControl isInvalid={!!(touched.field && errors.field)}>
              <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                {config.label}
              </FormControl.Label>
              <Input
                placeholder={config.placeholder}
                fontFamily="Geist"
                value={values.field}
                onChangeText={handleChange('field')}
                onBlur={handleBlur('field')}
                bg="white"
                borderRadius={8}
              />
              <FormControl.ErrorMessage>{errors.field}</FormControl.ErrorMessage>
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