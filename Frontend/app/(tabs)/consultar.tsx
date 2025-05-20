import { StyleSheet, Image, Platform, View, FlatList, Button, Linking, ScrollView } from 'react-native';

import { Collapsible } from '@/components/Collapsible';
import { ExternalLink } from '@/components/ExternalLink';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import api from '@/scripts/api';
import { useEffect, useState } from 'react';

type Articulo = {
  id: string;
  titulo: string;
  resumen: string;
  url: string;
};

const ArticulosList = () => {
  const [articulos, setArticulos] = useState<Articulo[]>([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const [porPagina] = useState(5);



  const getArticulos = async () => {
    try {
      const response = await api.get('/articulos');
      setArticulos(response.data);
    } catch (error) {
      console.error("Error al obtener artículos", error);
    }
  };

  const borrarArticulo = async (id: number) => {
    try {
      const response = await api.put('/borrar_articulo', null, {
        params: { id }
      });   
      getArticulos();

    } catch (error) {
      console.error("Error al borrar artículos", error);
    }
  };
  

  useEffect(() => {
    getArticulos();
  }, []);

  const totalPaginas = Math.ceil(articulos.length / porPagina);

  const articulosPaginados = articulos.slice(
    (paginaActual - 1) * porPagina,
    paginaActual * porPagina
  );
  getArticulos();
  return (
    <ScrollView>
    <View style={styles.container}>
      <FlatList
        data={articulosPaginados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <ThemedText style={styles.titulo}>{item.titulo}</ThemedText>
            <ThemedText style={styles.resumen}>{item.resumen}</ThemedText>
            <ThemedText
              style={styles.enlace}
              onPress={() => Linking.openURL(item.url)}>
              Ver en Wikipedia
            </ThemedText>

            <ThemedText
              style={styles.enlace}
              onPress={() => borrarArticulo(item.id)}>
              Borrar articulo
            </ThemedText>
          </View>
        )}
        
      />
      

      <View style={styles.pagination}>
        <Button
          title="Anterior"
          disabled={paginaActual === 1}
          onPress={() => setPaginaActual(paginaActual - 1)}
        />
        <ThemedText style={styles.pageInfo}>{`Página ${paginaActual} de ${totalPaginas}`}</ThemedText>
        <Button
          title="Siguiente"
          disabled={paginaActual === totalPaginas}
          onPress={() => setPaginaActual(paginaActual + 1)}
        />
      </View>
    </View>
    </ScrollView>

  );
  
};

export default ArticulosList;


const styles = StyleSheet.create({
  container: {
    padding: 12,
  },
  card: {
    backgroundColor: '#fff',
    padding: 8,
    marginBottom: 15,
    borderRadius: 6,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    elevation: 2,
  },
  titulo: {
    color: "black",
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  resumen: {
    fontSize: 14,
    color: '#555',
  },
  enlace: {
    color: 'blue',
    marginTop: 6,
    textDecorationLine: 'underline',
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 16,
  },
  pageInfo: {
    fontSize: 16,
  },
});
