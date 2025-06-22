import React, { useState } from 'react';
import { View, StyleSheet, TextInput, StatusBar, TouchableOpacity } from 'react-native';
import { Text, Button, HelperText } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { MaterialIcons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MainStackParamList } from 'src/navigation/types';
import { api } from 'src/api/axios';

type EditUserPinRoute = RouteProp<MainStackParamList, 'EditUserPin'>;

const PinSchema = Yup.object().shape({
  newPin: Yup.string().required('El nuevo pin es requerido').min(4, 'Mínimo 4 dígitos'),
  repeatPin: Yup.string()
    .oneOf([Yup.ref('newPin')], 'Los pines no coinciden')
    .required('Repite el nuevo pin'),
});

export function EditUserPinScreen() {
  const navigation = useNavigation();
  const route = useRoute<EditUserPinRoute>();
  const { id } = route.params;
  const [showNew, setShowNew] = useState(false);
  const [showRepeat, setShowRepeat] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = async (values: { newPin: string }) => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        // TODO: Show error toast
        setLoading(false);
        return;
      }
      const body = { pin: values.newPin };
      await api.patch(`/usuarios/${id}`, body, {
        headers: { Authorization: token },
      });
      // TODO: Show success toast
      navigation.goBack();
    } catch (error) {
      console.error(error);
      // TODO: Show error toast
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <MaterialIcons name="arrow-back-ios" size={20} color="#4f46e5" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cambiar pin</Text>
        <View style={{ width: 28 }} />
      </View>
      <Formik
        initialValues={{ newPin: '', repeatPin: '' }}
        validationSchema={PinSchema}
        onSubmit={(values) => handleSave({ newPin: values.newPin })}
      >
        {({ handleChange, handleBlur, handleSubmit, values, errors, touched }) => (
          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nuevo Pin</Text>
              <TextInput
                placeholder="****"
                style={styles.input}
                value={values.newPin}
                onChangeText={handleChange('newPin')}
                onBlur={handleBlur('newPin')}
                secureTextEntry={!showNew}
                keyboardType="numeric"
                maxLength={6}
              />
              <HelperText type="error" visible={!!(touched.newPin && errors.newPin)}>
                {errors.newPin}
              </HelperText>
            </View>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Repetir nuevo Pin</Text>
              <TextInput
                placeholder="****"
                style={styles.input}
                value={values.repeatPin}
                onChangeText={handleChange('repeatPin')}
                onBlur={handleBlur('repeatPin')}
                secureTextEntry={!showRepeat}
                keyboardType="numeric"
                maxLength={6}
              />
              <HelperText type="error" visible={!!(touched.repeatPin && errors.repeatPin)}>
                {errors.repeatPin}
              </HelperText>
            </View>
            <Button
              mode="contained"
              onPress={handleSubmit as any}
              style={styles.saveButton}
              labelStyle={styles.saveButtonText}
              loading={loading}
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