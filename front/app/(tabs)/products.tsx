import Ionicons from '@expo/vector-icons/Ionicons';
import { StyleSheet, FlatList, View } from 'react-native';

import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import ProductsScreen from '@/components/navigation/screens/ProductsScreen';
import { ComandaService, IApiResponse, IComanda } from '@/services/api/Comanda/ComandaService';
import React, { useState, useEffect } from 'react';

export default function TabTwoScreen() {
  const [comandas, setComanda] = useState<IApiResponse | null>(null);

  const consultarComanda = async () => {
    try {
      const dados = await ComandaService.getComandas();
      if (dados instanceof Error) {
        setComanda(null);
      } else {
        setComanda(dados);
      }
    } catch (error) {
      console.error('Erro', error);
    }
  };

  useEffect(() => {
    consultarComanda();
  }, []);

  const renderComanda = ({ item }: { item: IComanda }) => (
    <View style={styles.comandaItem}>
      <ThemedText type="default">{item.id}</ThemedText> 
      <ThemedText type="default">Status: {item.cliente}</ThemedText>
    </View>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#D0D0D0', dark: '#353636' }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
    >
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">
          {comandas ? 'Lista de Comandas' : 'Nenhuma comanda disponível'}
        </ThemedText>
      </ThemedView>
      {comandas && (
        <FlatList
          data={comandas.rows} 
          renderItem={renderComanda}
          keyExtractor={(item) => item.id.toString()}
        />
      )}
      <ProductsScreen />
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  comandaItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
});
