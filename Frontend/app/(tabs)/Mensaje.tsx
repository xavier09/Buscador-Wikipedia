// Mensaje.tsx
import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

type MensajeProps = {
  visible: boolean;
  texto: string;
  tipo?: 'info' | 'exito' | 'error';
  onClose: () => void;
};

export const Mensaje: React.FC<MensajeProps> = ({ visible, texto, tipo = 'info', onClose }) => {
  const color = {
    info: '#007bff',
    exito: '#28a745',
    error: '#dc3545',
  }[tipo];

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Text style={[styles.texto, { color }]}>{texto}</Text>
          <TouchableOpacity onPress={onClose} style={styles.boton}>
            <Text style={styles.textoBoton}>Cerrar</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    padding: 24,
    borderRadius: 10,
    minWidth: '70%',
    alignItems: 'center',
  },
  texto: {
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  boton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eee',
    borderRadius: 6,
  },
  textoBoton: {
    fontSize: 14,
    color: '#333',
  },
});
