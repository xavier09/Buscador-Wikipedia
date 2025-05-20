import { Image, StyleSheet, TextInput, Button, View, Text, FlatList, ScrollView } from 'react-native';
//import { HelloWave } from '@/components/HelloWave';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import React, { useState } from "react";
import api from '@/scripts/api';
import { Collapsible } from '@/components/Collapsible';
import { Mensaje } from './Mensaje';

export default function HomeScreen() {

  const [termino, setTermino] = useState("");
  const [articulos, setLista] = useState<{ titulo: string;  id: string; url: string; }[]>([]);
  const [resumen, setResumen] = useState<string>('');
  const [cantidadPalabras, setcantidadPalabras] =  useState<string>('');
  const [palabrasFrecuentes, setPalabrasFrecuentes] = useState<string>('');
  const [titulo, setTitulo] = useState("");
  const [Id, setID] = useState("");
  const [Url, setUrl] = useState("");
  const [mostrarResumen, setMostrarResumen] = useState(false);
  const [mostrarLista, setMostrarLista] = useState(false);

  //mensaje popup:
  const [mensaje, setMensaje] = useState('');
  const [tipoMensaje, setTipoMensaje] = useState<'info' | 'exito' | 'error'>('info');
  const [mostrarPopup, setMostrarPopup] = useState(false);



  const handleChange = (text: string) => {
    setTermino(text);
  };

  const buscarResumen = async (termino: string, id: string, url: string ) => {
   // const [articulos, setLista] = useState("");

    try {
      const response = await api.get(`/buscar_articulo`, {
        params: { termino: termino }
      });
      setTitulo(termino)
      setID(id)
      setUrl(url)

      setResumen(response.data.resumen);
      setcantidadPalabras(response.data.cantidad_palabras);

      const palabras = Object.entries(response.data.palabras_frecuentes)
      .map(([palabra, frecuencia]) => `${palabra} (${frecuencia})`)
      .join(', ');

    setPalabrasFrecuentes(palabras);
    
      setMostrarLista(false);
      setMostrarResumen(true);

    } catch (error) {
      console.error("Error al buscar", error);
    }
  };

  const handleSubmit = async () => {
    if (termino) {
      buscar(termino);
    }
  };

  const buscar = async (termino: string) => {
    try {
      setMostrarResumen(false);

      const response = await api.get(`/buscar`, {
        params: { termino }
      });
      setMostrarLista(true);
      setLista(response.data);

    } catch (error) {
      console.error("Error al buscar", error);
    }
  };

  const guardarArticulo = async (titulo: string, resumen: string, id: string, url: string) => {
    try {
      const response = await api.post('/guardar', {  id,titulo, resumen,  url});

      setMensaje(response.data);
      setTipoMensaje('info');
      setMostrarPopup(true); // Mostrar popup 

    } catch (error) {
      console.error("Error al guardar", error);
    }
  };

  return (
    <ScrollView style={styles.container}>

      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Buscador Wikipedia</ThemedText>
      </ThemedView>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Escribe algo..."
          value={termino}
          onChangeText={handleChange}
        />
        <Button title="Buscar" onPress={handleSubmit} />
  
   {mostrarLista && (
        <FlatList
  data={articulos}
  keyExtractor={(item, index) => item.id || index.toString()}
  renderItem={({ item }) => (
    <ThemedText
      style={styles.resultado}
      onPress={() => buscarResumen(item.titulo,item.id,item.url)}
    >
      {item.titulo}
    </ThemedText>
  )}

/>
   )}

  {mostrarResumen && (
        <View style={styles.container}>
<Mensaje
  visible={mostrarPopup}
  texto={mensaje}
  tipo={tipoMensaje}
  onClose={() => setMostrarPopup(false)}
/>
          <View style={styles.tituloContainer}>
            <ThemedText style={styles.titulo}>{titulo}</ThemedText>
          </View>
          <ThemedText>{resumen}</ThemedText>
          <ThemedText></ThemedText>
          <ThemedText style={styles.label}>Cantidad de palabas: {cantidadPalabras}</ThemedText> 
          <ThemedText style={styles.label}>Palabras frecuentes: {palabrasFrecuentes}</ThemedText> 
          <ThemedText style={styles.label}></ThemedText>
          <Button  title="Guardar articulo" onPress={() => guardarArticulo({titulo}.titulo,{resumen}.resumen,{Id}.Id,{Url}.Url)} />

        </View>
      )}

      </View>
    </ScrollView>
  );
  
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  container: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    backgroundColor: 'white',
    borderRadius: 4,
  },
  resultado: {
    paddingVertical: 6,
    fontSize: 16,
    borderBottomWidth: 0.5,
    borderColor: '#ccc',
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },

  tituloContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8, // Espacio entre el título/botón y el resumen
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    flexShrink: 1,
    marginTop: 10,
    marginRight: 8, // Espacio entre el título y el botón
  },


  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    flexShrink: 1,
    marginTop: 10,
    marginRight: 8, // Espacio entre el título y el botón
  },

});
