import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';

const NAV_BUTTONS = [
  {
    icon: <MaterialIcons name="map" size={36} color="#45475a" />, label: 'Mapa', onPress: (nav: any) => nav.navigate('Map'),
  },
  {
    icon: <MaterialIcons name="edit" size={36} color="#45475a" />, label: 'Crear anuncio', onPress: (nav: any) => nav.navigate('CreateAnnouncement'),
  },
  {
    icon: <MaterialIcons name="campaign" size={36} color="#45475a" />, label: 'Noticias', onPress: (nav: any) => nav.navigate('Announcements'),
  },
  {
    icon: <MaterialIcons name="groups" size={36} color="#45475a" />, label: 'Vecinos', onPress: (nav: any) => nav.navigate('Users'),
  },
  {
    icon: <MaterialIcons name="person" size={36} color="#45475a" />, label: 'Información Personal', onPress: (nav: any) => nav.navigate('PersonalInfo'),
  },
  {
    icon: <MaterialCommunityIcons name="alert-box-outline" size={36} color="#45475a" />, label: 'Registro de Alertas', onPress: (nav: any) => nav.navigate('AlertHistory'),
  },
];

export function MainNavigationScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>
            Inicio
          </Text>
        </View>
      </View>
      <View style={styles.content}>
        <View style={styles.navContainer}>
          <View style={styles.navGrid}>
            {NAV_BUTTONS.map((btn, idx) => (
              <TouchableOpacity
                key={btn.label}
                onPress={() => btn.onPress(navigation)}
                style={styles.navButton}
              >
                <View style={styles.navButtonContent}>
                  <View style={styles.navButtonInner}>
                    {btn.icon}
                    <Text style={styles.navButtonText}>
                      {btn.label}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={styles.alertContainer}>
          <TouchableOpacity
            onPress={() => navigation.navigate('SelectAlertType')}
            style={styles.alertButton}
          >
            <View style={styles.alertButtonContent}>
              <MaterialCommunityIcons name="alert-outline" size={64} color="#FF2D55" />
              <Text style={styles.alertButtonText}>
                Emitir{'\n'}Alerta
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f6fa',
  },
  header: {
    marginTop: 24,
    marginBottom: 16,
    alignItems: 'center',
  },
  titleContainer: {
    backgroundColor: 'white',
    borderRadius: 16,
    paddingHorizontal: 32,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 1,
  },
  title: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 18,
    color: '#4f46e5',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
  navContainer: {
    width: '90%',
    maxWidth: 400,
  },
  navGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  navButton: {
    width: '48%',
    marginBottom: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  navButtonContent: {
    width: '100%',
    height: 96,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: '#4f8cff',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 1,
  },
  navButtonInner: {
    alignItems: 'center',
    gap: 8,
  },
  navButtonText: {
    fontFamily: 'Geist',
    fontWeight: '500',
    fontSize: 16,
    color: '#4f8cff',
    textAlign: 'center',
  },
  alertContainer: {
    marginTop: 40,
    marginBottom: 16,
    alignItems: 'center',
  },
  alertButton: {
    alignSelf: 'center',
  },
  alertButtonContent: {
    borderRadius: 999,
    borderWidth: 8,
    borderColor: '#FF6A00',
    backgroundColor: 'white',
    width: 224,
    height: 224,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  alertButtonText: {
    fontFamily: 'Geist',
    fontWeight: '700',
    fontSize: 24,
    color: '#FF2D55',
    textAlign: 'center',
    lineHeight: 32,
    marginTop: 8,
  },
}); 