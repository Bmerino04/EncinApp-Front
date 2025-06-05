import React, { useState } from 'react';
import { Box, Button, FormControl, Input, Text, VStack, IconButton, Icon, StatusBar, TextArea, Pressable, HStack } from 'native-base';
import { useNavigation } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as ImagePicker from 'expo-image-picker';

const AnnouncementSchema = Yup.object().shape({
  title: Yup.string().required('El título es requerido'),
  description: Yup.string().required('La descripción es requerida'),
  date: Yup.date().required('La fecha es requerida'),
  location: Yup.string(),
});

export function CreateAnnouncementScreen() {
  const navigation = useNavigation();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [image, setImage] = useState<string | null>(null);

  const handlePickImage = async (setFieldValue: any) => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.7,
    });
    if (!result.canceled && result.assets && result.assets[0]?.uri) {
      setImage(result.assets[0].uri);
      setFieldValue('image', result.assets[0].uri);
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
        initialValues={{ title: '', description: '', date: '', location: '', image: '' }}
        validationSchema={AnnouncementSchema}
        onSubmit={values => {
          // Mock submit
          setTimeout(() => {
            navigation.goBack();
          }, 500);
        }}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
          <VStack space={4} px={6}>
            <FormControl isInvalid={!!(touched.title && errors.title)}>
              <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                Título del anuncio
              </FormControl.Label>
              <Input
                placeholder="Ingrese el título del anuncio"
                fontFamily="Geist"
                value={values.title}
                onChangeText={handleChange('title')}
                onBlur={handleBlur('title')}
                bg="white"
                borderRadius={8}
              />
              <FormControl.ErrorMessage>{errors.title}</FormControl.ErrorMessage>
            </FormControl>
            <FormControl isInvalid={!!(touched.description && errors.description)}>
              <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                Descripción del anuncio
              </FormControl.Label>
              <TextArea
                placeholder="Ingrese la descripción del anuncio."
                fontFamily="Geist"
                value={values.description}
                onChange={e => handleChange('description')(e.nativeEvent.text)}
                onBlur={handleBlur('description')}
                bg="white"
                borderRadius={8}
                h={20}
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
                    {values.date ? new Date(values.date).toLocaleDateString() : 'Selecciona la fecha'}
                  </Text>
                  <Icon as={MaterialIcons} name="expand-more" size={5} ml="auto" color="muted.400" />
                </HStack>
              </Pressable>
              {showDatePicker && (
                <DateTimePicker
                  value={values.date ? new Date(values.date) : new Date()}
                  mode="date"
                  display="default"
                  onChange={(_, selectedDate) => {
                    setShowDatePicker(false);
                    if (selectedDate) setFieldValue('date', selectedDate.toISOString());
                  }}
                />
              )}
              <FormControl.ErrorMessage>{errors.date}</FormControl.ErrorMessage>
            </FormControl>
            <FormControl>
              <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                Ubicación del anuncio (opcional)
              </FormControl.Label>
              <Input
                placeholder="Ej: Plaza de Armas, Temuco"
                fontFamily="Geist"
                value={values.location}
                onChangeText={handleChange('location')}
                onBlur={handleBlur('location')}
                bg="white"
                borderRadius={8}
              />
            </FormControl>
            <FormControl>
              <FormControl.Label _text={{ fontFamily: 'Geist', fontWeight: '500' }}>
                Adjunta una imagen o video informativo
                <Text fontWeight="400" color="muted.500"> (Opcional, pero recomendado)</Text>
              </FormControl.Label>
              <Pressable onPress={() => handlePickImage(setFieldValue)}>
                <Box
                  bg="muted.100"
                  borderRadius={12}
                  alignItems="center"
                  justifyContent="center"
                  py={6}
                  mt={1}
                >
                  {image ? (
                    <Text fontFamily="Geist" color="muted.700">Imagen seleccionada</Text>
                  ) : (
                    <VStack alignItems="center" space={2}>
                      <Icon as={MaterialIcons} name="image" size={8} color="muted.400" />
                      <Text fontFamily="Geist" color="teal.700" fontWeight="500">
                        Importar desde galería
                      </Text>
                    </VStack>
                  )}
                </Box>
              </Pressable>
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