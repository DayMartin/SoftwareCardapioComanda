import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ComandaService,
  IApiResponse,
  IComanda,
} from "@/services/api/Comanda/ComandaService";
import {
  ComandaProdutoService,
  Integration,
  ComandaProduto_listagem,
  Produto,
} from "@/services/api/Comanda/ComandaProdutoService";

const HomeScreen = () => {
  const [comandas, setComanda] = useState<IApiResponse | null>(null);
  const [produtosComanda, setprodutosComanda] = useState<Integration | null>(
    null
  );
  const [selectedComanda, setSelectedComanda] = useState<IComanda | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const consultarComanda = async () => {
    try {
      const dados = await ComandaService.getComandas();
      if (dados instanceof Error) {
        setComanda(null);
      } else {
        setComanda(dados);
      }
    } catch (error) {
      console.error("Erro", error);
    }
  };

  const consultarComandaProduto = async () => {
    if (!selectedComanda?.id) {
      console.error("Nenhuma comanda selecionada para consultar os produtos.");
      return;
    }

    try {
      const produtoDetalhes = await ComandaProdutoService.getByID(
        selectedComanda.id
      );

      if (produtoDetalhes instanceof Error) {
        setprodutosComanda(null);
      } else {
        setprodutosComanda(produtoDetalhes);
        console.log("produtoDetalhes", produtoDetalhes);
      }
    } catch (error) {
      console.error("Erro ao consultar os produtos da comanda:", error);
    }
  };

  useEffect(() => {
    consultarComanda();
  }, []);

  useEffect(() => {
    if (selectedComanda) {
      consultarComandaProduto();
    }
  }, [selectedComanda]);

  const renderComanda = ({ item }: { item: IComanda }) => (
    <View style={styles.comandaItem}>
      <ThemedText type="default">ID: {item.id}</ThemedText>
      <ThemedText type="default">Cliente: {item.cliente}</ThemedText>
      <TouchableOpacity
        style={styles.button}
        onPress={() => {
          setSelectedComanda(item); // Seleciona a comanda
          setModalVisible(true); // Abre o modal
        }}
      >
        <ThemedText type="default">Ver Detalhes</ThemedText>
      </TouchableOpacity>
    </View>
  );

  const renderProduto = ({ item }: { item: Produto }) => {
    return (
      <View style={styles.productItem}>
        <ThemedText>Produto ID: {item.id}</ThemedText>
        <ThemedText>Quantidade: {item.quantidade}</ThemedText>
      </View>
    );
  };

  return (
    <ParallaxScrollView
    headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
    headerImage={
      <Ionicons size={310} name="code-slash" style={styles.headerImage} />
    }
  >
    <ThemedView style={styles.titleContainer}>
      <ThemedText type="title">
        {comandas ? "Lista de Comandas" : "Nenhuma comanda disponível"}
      </ThemedText>
    </ThemedView>

    {/* Exibe a lista de comandas */}
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
          {selectedComanda ? (
            <>
              <ThemedText style={styles.title}>Detalhes da Comanda</ThemedText>
              <ThemedText>ID: {selectedComanda.id}</ThemedText>
              <ThemedText>Cliente: {selectedComanda.cliente}</ThemedText>

              <ThemedText style={styles.title}>Produtos:</ThemedText>

              {/* Checando se produtosComanda existe antes de renderizar */}
              {produtosComanda && produtosComanda.rows.length > 0 ? (
                <FlatList
                  data={produtosComanda.rows}
                  renderItem={renderProduto}
                  keyExtractor={(item) => item.id.toString()}
                />
              ) : (
                <ThemedText>Sem produtos disponíveis.</ThemedText>
              )}
            </>
          ) : (
            <ThemedText>
              Selecione uma comanda para ver os detalhes.
            </ThemedText>
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
    color: "#808080",
    bottom: -90,
    left: -35,
    position: "absolute",
  },
  titleContainer: {
    flexDirection: "row",
    gap: 8,
  },
  comandaItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  button: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#007BFF", // Cor do botão
    borderRadius: 5,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Fundo semi-transparente
  },
  modalContent: {
    width: "80%",
    backgroundColor: "#FFF",
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
    backgroundColor: "#FF6347", // Cor do botão de fechar
    borderRadius: 5,
    alignItems: "center",
  },
  productItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
});

export default HomeScreen;
