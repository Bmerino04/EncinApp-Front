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
  TextArea,
  Pressable,
  HStack,
  useToast,
} from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/api/axios';
import { jwtDecode } from 'jwt-decode';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';
import { Platform, TextInput } from 'react-native';

type NavigationProp = NativeStackNavigationProp<MainStackParamList, 'CreateAnnouncement'>;

interface TokenPayload {
  id_usuario: number;
}

const AnnouncementSchema = Yup.object().shape({
  title: Yup.string().required('El título es requerido'),
  description: Yup.string().required('La descripción es requerida'),
  date: Yup.string().required('La fecha es requerida'),
  location: Yup.string(),
});

export function CreateAnnouncementScreen() {
  const navigation = useNavigation<NavigationProp>();
  const toast = useToast();
  const [showDatePicker, setShowDatePicker] = useState(false);

  const handleSubmitAnnouncement = async (values: any) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        toast.show({ description: 'Token no encontrado. Inicia sesión' });
        return;
      }

      const decoded = jwtDecode<TokenPayload>(token);
      const userId = decoded.id_usuario;

      const payload = {
        titulo: values.title,
        cuerpo: values.description,
        fecha_relacionada: values.date,
        direccion: values.location,
        fecha_emision: new Date().toISOString().split('T')[0],
      };

      await api.post(`/anuncios/${userId}`, payload, {
        headers: { Authorization: token },
      });

      toast.show({ description: 'Anuncio publicado correctamente' });
      navigation.goBack();
    } catch (error) {
      console.error(error);
      toast.show({ description: 'Error al publicar el anuncio' });
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
          Crear Anuncio
        </Text>
      </Box>

      <Formik
        initialValues={{ title: '', description: '', date: '', location: '' }}
        validationSchema={AnnouncementSchema}
        onSubmit={handleSubmitAnnouncement}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <VStack space={4} px={6}>
            <FormControl isInvalid={!!(touched.title && errors.title)}>
              <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                Título del anuncio
              </FormControl.Label>
              <TextInput
                placeholder="Ingrese el título del anuncio"
                style={{
                  backgroundColor: 'white',
                  borderRadius: 8,
                  padding: 12,
                  fontFamily: 'Geist',
                }}
                value={values.title}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
              />
              <FormControl.ErrorMessage>{errors.title}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!(touched.description && errors.description)}>
              <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                Descripción del anuncio
              </FormControl.Label>
              <TextInput
                placeholder="Ingrese la descripción del anuncio."
                value={values.description}
                onChangeText={text => setFieldValue('description', text)}
                onBlur={handleBlur('description')}
                style={{
                  backgroundColor: 'white',
                  borderRadius: 8,
                  padding: 12,
                  fontFamily: 'Geist',
                }}
                multiline={true}
                numberOfLines={4}
              />
              <FormControl.ErrorMessage>{errors.description}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl isInvalid={!!(touched.date && errors.date)}>
              <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                Fecha relacionada
              </FormControl.Label>
              <Pressable onPress={() => setShowDatePicker(true)}>
                <HStack alignItems="center" bg="white" borderRadius={8} px={3} py={3}>
                  <Text fontFamily="Geist" color={values.date ? 'black' : 'muted.400'}>
                    {values.date
                      ? new Date(values.date).toLocaleDateString()
                      : 'Selecciona la fecha'}
                  </Text>
                  <Icon
                    as={MaterialIcons}
                    name="expand-more"
                    size={5}
                    ml="auto"
                    color="muted.400"
                  />
                </HStack>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={values.date ? new Date(values.date) : new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={(event, selectedDate) => {
                    if (Platform.OS !== 'ios') setShowDatePicker(false);
                    if (selectedDate) {
                      const iso = selectedDate.toISOString().split('T')[0];
                      setFieldValue('date', iso);
                    }
                  }}
                />
              )}
              <FormControl.ErrorMessage>{errors.date}</FormControl.ErrorMessage>
            </FormControl>

            <FormControl>
              <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                Ubicación del anuncio (opcional)
              </FormControl.Label>
              <TextInput
                placeholder="Ej: Plaza de Armas, Temuco"
                style={{
                  backgroundColor: 'white',
                  borderRadius: 8,
                  padding: 12,
                  fontFamily: 'Geist',
                }}
                value={values.location}
                onChangeText={handleChange('location')}
                onBlur={handleBlur('location')}
              />
            </FormControl>

            <Button
              mt={6}
              w="100%"
              bg="teal.600"
              _text={{ fontFamily: 'Geist', fontWeight: '600', fontSize: 'md' }}
              borderRadius={12}
              onPress={handleSubmit as any}
            >
              Publicar
            </Button>
          </VStack>
        )}
      </Formik>
    </Box>
  );
} 