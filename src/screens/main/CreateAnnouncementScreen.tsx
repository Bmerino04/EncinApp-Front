import React, { useState } from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, Platform, TextInput, KeyboardAvoidingView, ScrollView, Image } from 'react-native';
import { Text, Button, HelperText, ActivityIndicator } from 'react-native-paper';
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
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

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
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const [imageUploading, setImageUploading] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

  const handleSubmitAnnouncement = async (values: any) => {
    try {
      setSubmitting(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        // TODO: Show error toast
        setSubmitting(false);
        return;
      }

      const decoded = jwtDecode<TokenPayload>(token);
      const userId = decoded.id_usuario;

      let multimedia_url = '';
      let tipo_multimedia = '';
      if (image) {
        const url = await uploadToCatbox(image.uri);
        if (!url) return;
        multimedia_url = url;
        tipo_multimedia = 'imagen';
      }

      const payload = {
        titulo: values.title,
        cuerpo: values.description,
        fecha_relacionada: values.date,
        direccion: values.location,
        fecha_emision: new Date().toISOString().split('T')[0],
        multimedia_url,
        tipo_multimedia,
      };

      console.log('ANNOUNCEMENT CREATE ENDPOINT:', '/anuncios');
      console.log('ANNOUNCEMENT CREATE PAYLOAD:', payload);
      await api.post('/anuncios', payload, {
        headers: { Authorization: token },
      });

      // TODO: Show success toast
      navigation.goBack();
    } catch (error) {
      console.error(error);
      // TODO: Show error toast
    } finally {
      setSubmitting(false);
    }
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0]);
    }
  };

  const uploadToCatbox = async (localUri: string) => {
    setImageUploading(true);
    const formData = new FormData();
    formData.append('reqtype', 'fileupload');
    formData.append('fileToUpload', {
      uri: localUri,
      name: 'image.jpg',
      type: 'image/jpeg',
    });
    try {
      const res = await fetch('https://catbox.moe/user/api.php', {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const url = await res.text();
      if (url.startsWith('https://')) {
        setImageUrl(url);
        return url;
      } else {
        throw new Error('Upload failed');
      }
    } catch (e) {
      Alert.alert('Error', 'No se pudo subir la imagen.');
      return null;
    } finally {
      setImageUploading(false);
    }
  };

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView
        contentContainerStyle={[styles.container, { flexGrow: 1, paddingBottom: 32 }]}
        keyboardShouldPersistTaps="handled"
      >
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back-ios" size={20} color="#4f46e5" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Crear Anuncio</Text>
          <View style={{ width: 28 }} />
        </View>
        {submitting ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" />
          </View>
        ) : (
          <Formik
            initialValues={{ title: '', description: '', date: '', location: '' }}
            validationSchema={AnnouncementSchema}
            onSubmit={handleSubmitAnnouncement}
          >
            {({ handleChange, handleBlur, handleSubmit, values, errors, touched, setFieldValue }) => (
              <View style={styles.form}>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Título del anuncio</Text>
                  <TextInput
                    placeholder="Ingrese el título del anuncio"
                    style={styles.input}
                    value={values.title}
                    onChangeText={handleChange('title')}
                    onBlur={handleBlur('title')}
                  />
                  <HelperText type="error" visible={!!(touched.title && errors.title)}>
                    {errors.title}
                  </HelperText>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Descripción del anuncio</Text>
                  <TextInput
                    placeholder="Ingrese la descripción del anuncio."
                    value={values.description}
                    onChangeText={text => setFieldValue('description', text)}
                    onBlur={handleBlur('description')}
                    style={[styles.input, { minHeight: 80 }]}
                    multiline={true}
                    numberOfLines={4}
                  />
                  <HelperText type="error" visible={!!(touched.description && errors.description)}>
                    {errors.description}
                  </HelperText>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Fecha relacionada</Text>
                  <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerButton}>
                    <View style={styles.datePickerContent}>
                      <Text style={[styles.dateText, { color: values.date ? '#000' : '#9ca3af' }]}> 
                        {values.date
                          ? new Date(values.date).toLocaleDateString()
                          : 'Selecciona la fecha'}
                      </Text>
                      <MaterialIcons name="expand-more" size={20} color="#9ca3af" style={{ marginLeft: 'auto' }} />
                    </View>
                  </TouchableOpacity>
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
                  <HelperText type="error" visible={!!(touched.date && errors.date)}>
                    {errors.date}
                  </HelperText>
                </View>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Ubicación del anuncio (opcional)</Text>
                  <TextInput
                    placeholder="Ingrese la ubicación"
                    style={styles.input}
                    value={values.location}
                    onChangeText={handleChange('location')}
                    onBlur={handleBlur('location')}
                  />
                </View>
                <Button
                  mode="outlined"
                  style={{ marginVertical: 12 }}
                  onPress={pickImage}
                  loading={imageUploading}
                  disabled={imageUploading}
                >
                  {image ? 'Cambiar Imagen' : 'Agregar Imagen'}
                </Button>
                {image && (
                  <Image source={{ uri: image.uri }} style={{ width: '100%', height: 200, borderRadius: 12, marginBottom: 12 }} />
                )}
                <Button
                  mode="contained"
                  onPress={handleSubmit as any}
                  style={styles.saveButton}
                  labelStyle={styles.saveButtonText}
                >
                  Publicar
                </Button>
              </View>
            )}
          </Formik>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
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
  datePickerButton: {
    backgroundColor: 'white',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginTop: 2,
    marginBottom: 2,
  },
  datePickerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateText: {
    fontFamily: 'Geist',
    fontWeight: '400',
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