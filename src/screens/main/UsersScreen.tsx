import React, { useEffect, useState } from 'react';
import { Box, Text, IconButton, Icon, StatusBar, Spinner } from 'native-base';
import { FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { UserListItem, User } from 'src/components/common/UserListItem';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MainStackParamList } from 'src/navigation/types';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from 'src/api/axios';

interface UsuarioApi {
  id_usuario: number;
  nombre: string;
  rut: string;
  pin: string;
  es_presidente: boolean;
  disponibilidad: boolean;
  direccion: string;
}

export function UsersScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const [usuarios, setUsuarios] = useState<UsuarioApi[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUsuarios = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) {
          console.log('No token found');
          setLoading(false);
          return;
        }
        const response = await api.get('/usuarios', {
          headers: {
            Authorization: token,
          },
        });
        setUsuarios(response.data.usuariosEncontrados);
      } catch (error) {
        console.error('Error fetching users:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchUsuarios();

    const unsubscribe = navigation.addListener('focus', () => {
      setLoading(true); 
      fetchUsuarios();
    });

    return unsubscribe;
  }, [navigation]);


  if (loading) {
    return (
      <Box flex={1} justifyContent="center" alignItems="center">
        <Spinner size="lg" />
      </Box>
    );
  }

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
        mb={2}
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
          Vecinos
        </Text>
        <IconButton
          icon={<Icon as={MaterialCommunityIcons} name="account-plus-outline" size={6} color="muted.500" />}
          borderRadius="full"
          variant="ghost"
          onPress={() => navigation.navigate('UserRegister')}
        />
      </Box>
      <FlatList
        data={usuarios}
        keyExtractor={(item) => item.id_usuario.toString()}
        renderItem={({ item }) => (
          <UserListItem
            user={{
              id: item.id_usuario,
              nombre: item.nombre,
              rut: item.rut,
              direccion: item.direccion,
              pin: item.pin,
              disponibilidad: item.disponibilidad,
              permisos: [], 
            }}
            onPress={() => navigation.navigate('UserDetail', { id: String(item.id_usuario) })}
          />
        )}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      />
    </Box>
  );
}
