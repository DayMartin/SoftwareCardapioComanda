import { View, StyleSheet, FlatList, TouchableOpacity, Modal } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { ComandaService, IApiResponse, IComanda } from '@/services/api/Comanda/ComandaService';
import React, { useState, useEffect } from 'react';

const HomeScreen = () => {
  const [comandas, setComanda] = useState<IApiResponse | null>(null);
  const [selectedComanda, setSelectedComanda] = useState<IComanda | null>(null);
  const [modalVisible, setModalVisible] = useState(false); // Estado para controlar o modal

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
      <ThemedText type="default">Cliente: {item.cliente}</ThemedText>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setSelectedComanda(item);
          setModalVisible(true);
        }}
      >
        <ThemedText type="default">Ver Detalhes</ThemedText>
      </TouchableOpacity>
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

      {/* Modal para mostrar os detalhes da comanda */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedComanda && (
              <>
                <ThemedText style={styles.title}>Detalhes da Comanda</ThemedText>
                <ThemedText>ID: {selectedComanda.id}</ThemedText>
                <ThemedText>Cliente: {selectedComanda.cliente}</ThemedText>
                <ThemedText>Produtos: {selectedComanda.produtos}</ThemedText>
              </>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <ThemedText type="default">Fechar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
};

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
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#007BFF', // Cor do botão
    borderRadius: 5,
    alignItems: 'center',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Fundo semi-transparente
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#FFF',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#FF6347', // Cor do botão de fechar
    borderRadius: 5,
    alignItems: 'center',
  },
});

export default HomeScreen;
