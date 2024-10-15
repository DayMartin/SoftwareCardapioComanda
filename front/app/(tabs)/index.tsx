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
  Produto,
  ComandaProduto_create,
} from "@/services/api/Comanda/ComandaProdutoService";
import {
  EstoqueService,
  IEstoque_view,
  IApiResponseProdutos,
} from "@/services/api/Estoque/EstoqueService";

const HomeScreen = () => {
  const [comandas, setComanda] = useState<IApiResponse | null>(null);
  const [produtosComanda, setprodutosComanda] = useState<Integration | null>(null);
  const [selectedComanda, setSelectedComanda] = useState<IComanda | null>(null);
  const [produtos, setProdutos] = useState<IApiResponseProdutos | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [modalProdutoVisible, setModalProdutoVisible] = useState(false);

  // Consultar comandas disponíveis
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

  // Consultar os produtos já adicionados à comanda selecionada
  const consultarComandaProduto = async () => {
    if (!selectedComanda?.id) {
      console.error("Nenhuma comanda selecionada para consultar os produtos.");
      return;
    }

    try {
      const produtoDetalhes = await ComandaProdutoService.getByID(selectedComanda.id);
      if (produtoDetalhes instanceof Error) {
        setprodutosComanda(null);
      } else {
        setprodutosComanda(produtoDetalhes);

        
        produtoDetalhes.rows.forEach(async (dados) => {
          const idProduto = dados.id
          const consultarDetalheProduto = await EstoqueService.getByID(idProduto);
          if (consultarDetalheProduto instanceof Error) {
            console.log('error', Error)
          } else {
            console.log('foi', consultarDetalheProduto)
          }

        });
      }
    } catch (error) {
      console.error("Erro ao consultar os produtos da comanda:", error);
    }
  };

  // Consultar todos os produtos disponíveis no estoque
  const consultarProdutos = async () => {
    try {
      const produtos = await EstoqueService.getAllList();
      if (produtos instanceof Error) {
        setProdutos(null);
      } else {
        setProdutos(produtos);
      }
    } catch (error) {
      console.error("Erro ao consultar os produtos da comanda:", error);
    }
  };

  // Salvar novos produtos na comanda selecionada
  const salvarProdutos = async (dados: ComandaProduto_create) => {
          console.log('dados enviados', dados)

    try {
      const produtos = await ComandaProdutoService.insert(dados);
      if (produtos instanceof Error) {
        console.error("Erro ao salvar os produtos na comanda.");
      } else {
        console.log("Produtos salvos com sucesso:", produtos);
      }
    } catch (error) {
      console.error("Erro ao salvar produtos da comanda:", error);

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

  const abrirModalProdutos = () => {
    consultarProdutos(); 
    setModalProdutoVisible(true); 
  };

  // Função para renderizar a comanda
  const renderComanda = ({ item }: { item: IComanda }) => (
    <View style={styles.comandaItem}>
      <ThemedText type="default">ID: {item.id}</ThemedText>
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

  // Função para renderizar produtos da comanda
  const renderProduto = ({ item }: { item: Produto }) => (
    <View style={styles.productItem}>
      <ThemedText>Produto ID: {item.id}</ThemedText>
      <ThemedText>Quantidade: {item.quantidade}</ThemedText>
    </View>
  );

  // Função para renderizar produtos disponíveis no estoque
  const renderProdutos = ({ item }: { item: IEstoque_view }) => (
    <View style={styles.productItem}>
      <ThemedText>Nome: {item.nome}</ThemedText>
      <ThemedText>Preço: {item.preco}</ThemedText>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => {
          if (selectedComanda) {
            salvarProdutos({
              comanda: selectedComanda.id,
              produto: [
                {
                  id: item.id,
                  quantidade: 1,
                  tipo: "Adicionar",
                },
              ],
            });
            
            setModalProdutoVisible(false); 
          }
        }}
      >
        <ThemedText>Adicionar</ThemedText>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.closeButton}
        onPress={() => {
          if (selectedComanda) {
            salvarProdutos({
              comanda: selectedComanda.id,
              produto: [
                {
                  id: item.id,
                  quantidade: 1,
                  tipo: "Excluir",
                },
              ],
            });
            
            setModalProdutoVisible(false); 
          }
        }}
      >
        <ThemedText>Excluir</ThemedText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: "#D0D0D0", dark: "#353636" }}
      headerImage={<Ionicons size={310} name="code-slash" style={styles.headerImage} />}
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

                {/* Renderiza os produtos da comanda */}
                {produtosComanda && produtosComanda.rows.length > 0 ? (
                  <FlatList
                    data={produtosComanda.rows}
                    renderItem={renderProduto}
                    keyExtractor={(item) => item.id.toString()}
                  />
                ) : (
                  <ThemedText>Sem produtos disponíveis.</ThemedText>
                )}

                <TouchableOpacity
                  style={styles.button}
                  onPress={abrirModalProdutos} 
                >
                  <ThemedText type="default">Adicionar produto</ThemedText>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <ThemedText type="default">Fechar</ThemedText>
                </TouchableOpacity>
              </>
            ) : (
              <ThemedText>Selecione uma comanda para ver os detalhes.</ThemedText>
            )}
          </View>
        </View>
      </Modal>

      {/* Modal para adicionar produtos à comanda */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalProdutoVisible}
        onRequestClose={() => setModalProdutoVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {produtos ? (
              <>
                <ThemedText style={styles.title}>Produtos Disponíveis</ThemedText>

                {/* Renderiza os produtos do estoque */}
                {produtos.rows.length > 0 ? (
                  <FlatList
                    data={produtos.rows}
                    renderItem={renderProdutos}
                    keyExtractor={(item) => item.id.toString()}
                  />
                ) : (
                  <ThemedText>Sem produtos disponíveis.</ThemedText>
                )}
              </>
            ) : (
              <ThemedText>Problemas ao carregar os produtos.</ThemedText>
            )}

            <TouchableOpacity
              style={styles.button}
              onPress={() => setModalProdutoVisible(false)}
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
    backgroundColor: "#007BFF", 
    borderRadius: 5,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)", 
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
    backgroundColor: "#FF6347", 
    borderRadius: 5,
    alignItems: "center",
  },
  saveButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: "#63FF47", 
    borderRadius: 5,
    alignItems: "center",
  },
  productItem: {
    paddingVertical: 5,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  addButton: {
    padding: 10,
    backgroundColor: "#63FF47",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
});

export default HomeScreen;
