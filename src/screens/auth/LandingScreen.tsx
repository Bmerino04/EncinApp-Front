import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { AuthStackParamList } from 'src/navigation/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { LinearGradient } from 'expo-linear-gradient';

type NavigationProp = NativeStackNavigationProp<AuthStackParamList, 'Landing'>;

export function LandingScreen() {
  const navigation = useNavigation<NavigationProp>();

  const handleLogin = () => {
    navigation.navigate('Login');
  };

  return (
    <LinearGradient
      colors={['#a18cd1', '#fbc2eb']}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>EncinApp</Text>
          <Text style={styles.subtitle}>
            Tu red de ayuda en{'\n'}Villa Las Encinas.
          </Text>
        </View>
        <Button
          mode="contained"
          onPress={handleLogin}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Iniciar Sesión
        </Button>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 64,
  },
  title: {
    fontFamily: 'Geist-Bold',
    fontSize: 40,
    color: 'white',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: 'Geist',
    fontSize: 18,
    color: 'white',
    textAlign: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 12,
    backgroundColor: '#4f46e5',
  },
  buttonText: {
    fontFamily: 'Geist-SemiBold',
    fontSize: 18,
  },
}); 