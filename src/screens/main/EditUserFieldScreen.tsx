import React from 'react';
import { View, StyleSheet, StatusBar, TouchableOpacity, TextInput } from 'react-native';
import { Text, Button, HelperText } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainStackParamList } from 'src/navigation/types';
import { api } from 'src/api/axios';

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
    fieldKey: 'nombre',
  },
  EditUserAddress: {
    label: 'Dirección nueva',
    placeholder: 'dirección',
    validation: Yup.string().required('La dirección es requerida'),
    title: 'Cambiar dirección',
    fieldKey: 'direccion',
  },
  EditUserRut: {
    label: 'Rut nuevo',
    placeholder: 'rut',
    validation: Yup.string().required('El rut es requerido'),
    title: 'Cambiar rut',
    fieldKey: 'rut',
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

  const handleSave = async (values: { field: string }) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        // TODO: Show error toast
        return;
      }
      const body = { [config.fieldKey]: values.field };
      await api.patch(`/usuarios/${id}`, body, {
        headers: { Authorization: token },
      });
      // TODO: Show success toast
      navigation.goBack();
    } catch (error) {
      console.error(error);
      // TODO: Show error toast
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{config.title}</Text>
        <View style={{ width: 28 }} />
      </View>
      <Formik
        initialValues={{ field: value || '' }}
        validationSchema={validationSchema}
        onSubmit={handleSave}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{config.label}</Text>
              <TextInput
                placeholder={config.placeholder}
                style={styles.input}
                value={values.field}
                onChangeText={handleChange('field')}
                onBlur={handleBlur('field')}
              />
              <HelperText type="error" visible={!!(touched.field && errors.field)}>
                {errors.field}
              </HelperText>
            </View>
            <Button
              mode="contained"
              onPress={handleSubmit as any}
              style={styles.saveButton}
              labelStyle={styles.saveButtonText}
            >
              Guardar
            </Button>
          </View>
        )}
      </Formik>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  form: {
    paddingHorizontal: 24,
    marginTop: 32,
    gap: 24,
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