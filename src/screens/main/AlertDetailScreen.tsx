import React, { useEffect, useState } from 'react';
import { View, StyleSheet, TouchableOpacity, StatusBar, ScrollView, TextInput, FlatList, KeyboardAvoidingView, Platform, Modal, Alert } from 'react-native';
import { Text, ActivityIndicator, Button } from 'react-native-paper';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialIcons, MaterialCommunityIcons } from '@expo/vector-icons';
import { MainStackParamList } from 'src/navigation/types';
import { api } from 'src/api/axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getCurrentLocation, calculateDistance } from 'src/utils/location';

const SUGGESTED_REPLIES = [
  'En Camino',
  'Atendido',
  'Estoy en el Lugar',
];

type AlertDetailRouteProp = RouteProp<MainStackParamList, 'AlertDetail'>;

export function AlertDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<MainStackParamList>>();
  const route = useRoute<AlertDetailRouteProp>();
  const { id } = route.params;

  const [alert, setAlert] = useState<any>(null);
  const [comments, setComments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [commentInput, setCommentInput] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [showDeleteAlertModal, setShowDeleteAlertModal] = useState(false);
  const [showDeleteCommentModal, setShowDeleteCommentModal] = useState<{ visible: boolean; idx: number | null }>({ visible: false, idx: null });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const token = await AsyncStorage.getItem('userToken');
        // Fetch alert details
        const alertRes = await api.get(`/alertas/${id}`, { headers: { Authorization: token } });
        setAlert(alertRes.data.anuncioEncontrado || alertRes.data.alertaEncontrada || alertRes.data);
        // Fetch comments
        const commentsRes = await api.get(`/alertas/${id}/comentarios`, { headers: { Authorization: token } });
        setComments(Array.isArray(commentsRes.data.comentariosEncontrados) ? commentsRes.data.comentariosEncontrados : []);
        // Get user location
        const loc = await getCurrentLocation();
        setUserLocation(loc);
      } catch (e) {
        setAlert(null);
        setComments([]);
      }
      setLoading(false);
    };
    fetchData();
  }, [id]);

  const handleDeleteAlert = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      const res = await api.delete(`/alertas/${id}`, { headers: { Authorization: token } });
      setShowDeleteAlertModal(false);
      navigation.navigate('AlertHistory');
    } catch (e) {
      setShowDeleteAlertModal(false);
      console.error('Failed to delete alert:', e);
      Alert.alert('Error', 'No se pudo eliminar la alerta. Intenta de nuevo.');
    }
  };

  const handleDeleteComment = async () => {
    if (showDeleteCommentModal.idx === null) return;
    try {
      const token = await AsyncStorage.getItem('userToken');
      await api.delete(`/alertas/${id}/comentarios/${showDeleteCommentModal.idx}`, { headers: { Authorization: token } });
      setComments(comments => comments.filter((c) => c.id_comentario !== showDeleteCommentModal.idx));
    } catch (e) {}
    setShowDeleteCommentModal({ visible: false, idx: null });
  };

  const handleSendComment = async (text: string) => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      await api.post(`/alertas/${id}/comentarios`, { contenido: text }, { headers: { Authorization: token } });
      setComments(prev => [...prev, { contenido: text, fecha_emision: new Date().toISOString() }]);
      setCommentInput('');
    } catch (e) {}
    setSubmitting(false);
  };

  if (loading || !alert) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Distance calculation
  let distance = null;
  if (userLocation && alert.latitud && alert.longitud) {
    distance = calculateDistance(userLocation.latitude, userLocation.longitude, alert.latitud, alert.longitud);
  }

  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <MaterialIcons name="arrow-back-ios" size={20} color="#4f46e5" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Alerta</Text>
        </View>
        <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <View style={styles.alertCard}>
            <View style={styles.alertCardRow}>
              <MaterialCommunityIcons name={getAlertIcon(alert.tipo)} size={36} color={getAlertColor(alert.tipo)} />
              <Text style={styles.alertType}>Alerta de {capitalize(alert.tipo)}</Text>
            </View>
            {distance && (
              <View style={styles.alertMetaRow}>
                <MaterialIcons name="location-on" size={16} color="#6b7280" />
                <Text style={styles.alertMeta}>A {distance} km</Text>
              </View>
            )}
            <Text style={styles.alertAddress}>{alert.direccion || `${alert.latitud}, ${alert.longitud}`}</Text>
            <Text style={styles.alertMeta}>Publicado por: {alert.nombre_usuario || 'Desconocido'}</Text>
            <Text style={styles.alertMeta}>{formatDate(alert.fecha_emision)} - {formatTime(alert.fecha_emision)}</Text>
          </View>
          <Text style={styles.responsesTitle}>Respuestas</Text>
          {comments.map((comment, idx) => (
            <View key={comment.id_comentario} style={styles.commentCard}>
              <View style={styles.commentHeader}>
                <Text style={styles.commentAuthor}>{comment.nombre_usuario || 'Usuario'}</Text>
                <TouchableOpacity onPress={() => setShowDeleteCommentModal({ visible: true, idx: comment.id_comentario })}>
                  <MaterialIcons name="delete-outline" size={20} color="#d20f39" />
                </TouchableOpacity>
              </View>
              <Text style={styles.commentContent}>{comment.contenido}</Text>
            </View>
          ))}
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.suggestedRow} contentContainerStyle={{ gap: 8 }}>
            {SUGGESTED_REPLIES.map((reply, idx) => (
              <TouchableOpacity key={reply} style={styles.suggestedButton} onPress={() => setCommentInput(reply)}>
                <Text style={styles.suggestedButtonText}>{reply}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
          <View style={styles.inputRow}>
            <TextInput
              style={styles.input}
              placeholder="Responder"
              value={commentInput}
              onChangeText={setCommentInput}
              editable={!submitting}
              onSubmitEditing={() => handleSendComment(commentInput)}
              returnKeyType="send"
            />
            <Button mode="contained" onPress={() => handleSendComment(commentInput)} loading={submitting} disabled={submitting || !commentInput.trim()} style={styles.sendButton} labelStyle={{ color: 'white', fontWeight: '600' }}>
              Enviar
            </Button>
          </View>
        </ScrollView>
      </View>
      {/* Delete Alert Modal */}
      <Modal
        visible={showDeleteAlertModal}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteAlertModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Eliminar alerta?</Text>
            <Text style={styles.modalText}>¿Estás seguro de que quieres eliminar esta alerta? Esta acción no se puede deshacer.</Text>
            <View style={styles.modalActions}>
              <Button mode="text" onPress={() => setShowDeleteAlertModal(false)} style={styles.modalCancel}>Cancelar</Button>
              <Button mode="contained" onPress={handleDeleteAlert} style={styles.modalDelete}>Eliminar</Button>
            </View>
          </View>
        </View>
      </Modal>
      {/* Delete Comment Modal */}
      <Modal
        visible={showDeleteCommentModal.visible}
        transparent
        animationType="fade"
        onRequestClose={() => setShowDeleteCommentModal({ visible: false, idx: null })}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>¿Eliminar comentario?</Text>
            <Text style={styles.modalText}>¿Estás seguro de que quieres eliminar este comentario?</Text>
            <View style={styles.modalActions}>
              <Button mode="text" onPress={() => setShowDeleteCommentModal({ visible: false, idx: null })} style={styles.modalCancel}>Cancelar</Button>
              <Button mode="contained" onPress={handleDeleteComment} style={styles.modalDelete}>Eliminar</Button>
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

function capitalize(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function formatDate(dateStr: string) {
  // Try to parse and format as DD MMM YYYY
  const date = new Date(dateStr.replace(/(\d{2}):(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/, '$4/$5/$6 $1:$2:$3'));
  if (!isNaN(date.getTime())) {
    return date.toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
  }
  return dateStr;
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr.replace(/(\d{2}):(\d{2}):(\d{2}) (\d{2})\/(\d{2})\/(\d{4})/, '$4/$5/$6 $1:$2:$3'));
  if (!isNaN(date.getTime())) {
    return date.toLocaleTimeString('es-CL', { hour: '2-digit', minute: '2-digit', hour12: false });
  }
  return '';
}

function getAlertIcon(tipo: string) {
  switch (tipo) {
    case 'salud': return 'heart-pulse';
    case 'siniestro': return 'fire';
    case 'seguridad': return 'incognito';
    default: return 'alert-circle-outline';
  }
}
function getAlertColor(tipo: string) {
  switch (tipo) {
    case 'salud': return '#2563eb';
    case 'siniestro': return '#ea580c';
    case 'seguridad': return '#16a34a';
    default: return '#4f46e5';
  }
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f6fa' },
  centerContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 16,
    marginHorizontal: 12,
    marginTop: 12,
    marginBottom: 16,
    paddingHorizontal: 8,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 1,
  },
  backButton: { borderRadius: 999, padding: 4 },
  headerTitle: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 18,
    color: '#4f46e5',
    flex: 1,
    textAlign: 'center',
    marginRight: 28,
  },
  alertCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 12,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2.22,
    elevation: 1,
  },
  alertCardRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  alertType: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 18,
    color: '#22223b',
    marginLeft: 8,
  },
  alertMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  alertMeta: {
    fontFamily: 'Geist',
    fontSize: 14,
    color: '#6b7280',
    marginLeft: 4,
  },
  alertAddress: {
    fontFamily: 'Geist',
    fontSize: 15,
    color: '#374151',
    marginBottom: 4,
  },
  responsesTitle: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 16,
    color: '#22223b',
    marginLeft: 16,
    marginBottom: 8,
  },
  commentCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    marginHorizontal: 12,
    marginBottom: 10,
    flexDirection: 'column',
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  commentAuthor: {
    fontFamily: 'Geist',
    fontWeight: '600',
    fontSize: 15,
    color: '#22223b',
  },
  commentContent: {
    fontFamily: 'Geist',
    fontSize: 15,
    color: '#374151',
    marginTop: 2,
  },
  suggestedRow: {
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 12,
    minHeight: 40,
  },
  suggestedButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  suggestedButtonText: {
    fontFamily: 'Geist',
    fontWeight: '500',
    fontSize: 15,
    color: '#4f46e5',
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 12,
    marginTop: 8,
    backgroundColor: 'white',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: 'Geist',
    fontSize: 15,
    color: '#22223b',
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 24,
    width: 300,
    alignItems: 'center',
  },
  modalTitle: {
    fontFamily: 'Geist',
    fontWeight: '700',
    fontSize: 18,
    color: '#d20f39',
    marginBottom: 8,
  },
  modalText: {
    fontFamily: 'Geist',
    fontSize: 15,
    color: '#22223b',
    marginBottom: 16,
    textAlign: 'center',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
  },
  modalCancel: {
    backgroundColor: 'transparent',
  },
  modalDelete: {
    backgroundColor: '#d20f39',
  },
  sendButton: {
    borderRadius: 8,
    backgroundColor: '#4f46e5',
    marginLeft: 4,
  },
}); 