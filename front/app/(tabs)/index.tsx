import {
  View,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Modal,
  TextInput,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import ParallaxScrollView from "@/components/ParallaxScrollView";
import Ionicons from "@expo/vector-icons/Ionicons";
import {
  ComandaCreate,
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
  const [modalAdicionarVisible, setModalAdicionarVisible] = useState(false); // Novo estado para modal de adicionar comanda
  const [novoCliente, setNovoCliente] = useState("");

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
      const produtoDetalhes = await ComandaProdutoService.getByID(selectedComanda.id);
      if (produtoDetalhes instanceof Error) {
        setprodutosComanda(null);
      } else {
        setprodutosComanda(produtoDetalhes);

        produtoDetalhes.rows.forEach(async (dados) => {
          const idProduto = dados.id;
          const consultarDetalheProduto = await EstoqueService.getByID(idProduto);
          if (consultarDetalheProduto instanceof Error) {
            console.log('error', Error);
          } else {
            console.log('foi', consultarDetalheProduto);
          }
        });
      }
    } catch (error) {
      console.error("Erro ao consultar os produtos da comanda:", error);
    }
  };

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

  const salvarProdutos = async (dados: ComandaProduto_create) => {
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

  const newComanda = async (dados: ComandaCreate) => {
    try {
      const save = await ComandaService.create(dados);
      if (save instanceof Error) {
        console.error("Erro ao salvar uma nova comanda.");
      } else {
        console.log("Nova comanda criada com sucesso:", save);
        consultarComanda(); // Atualizar a lista de comandas
      }
    } catch (error) {
      console.error("Erro ao salvar uma nova comanda:", error);
    }
  }

  const abrirModalAdicionar = () => {
    setNovoCliente("");
    setModalAdicionarVisible(true);
  };

  const salvarNovaComanda = () => {
    if (novoCliente.trim()) {
      newComanda({ cliente: novoCliente });
      setModalAdicionarVisible(false);
    } else {
      alert("Por favor, insira o nome do cliente.");
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

  const renderComanda = ({ item }: { item: IComanda }) => (
    <View style={styles.comandaItem}>
      <ThemedText style={styles.textStyle} type="default">ID: {item.id}</ThemedText>
      <ThemedText style={styles.textStyle} type="default">Cliente: {item.cliente}</ThemedText>
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

  const renderProduto = ({ item }: { item: Produto }) => (
    <View style={styles.productItem}>
      <View style={styles.rowContainer}>
      <ThemedText style={styles.textStyle}>Produto ID: {item.id} </ThemedText>
      <ThemedText style={styles.textStyle}>Quantidade: {item.quantidade} </ThemedText>
      </View>
    </View>

  );

  const renderProdutos = ({ item }: { item: IEstoque_view }) => (
    <View style={styles.productItem}>
      <ThemedText style={styles.textStyle}>Nome: {item.nome}</ThemedText>
      <ThemedText style={styles.textStyle}>Preço: {item.preco}</ThemedText>
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

      <TouchableOpacity style={styles.addButton} onPress={abrirModalAdicionar}>
        <ThemedText type="default">Adicionar Comanda</ThemedText>
      </TouchableOpacity>

      {comandas && (
        <FlatList
          data={comandas.rows}
          renderItem={renderComanda}
          keyExtractor={(item) => item.id.toString()}
        />
      )}

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
                  <ThemedText>Fechar</ThemedText>
                </TouchableOpacity>
              </>
            ) : (
              <ThemedText>Carregando...</ThemedText>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalProdutoVisible}
        onRequestClose={() => setModalProdutoVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.title}>Adicionar Produto</ThemedText>
            {produtos && produtos.rows.length > 0 ? (
              <FlatList
                data={produtos.rows}
                renderItem={renderProdutos}
                keyExtractor={(item) => item.id.toString()}
              />
            ) : (
              <ThemedText>Sem produtos disponíveis.</ThemedText>
            )}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalProdutoVisible(false)}
            >
              <ThemedText>Fechar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalAdicionarVisible}
        onRequestClose={() => setModalAdicionarVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ThemedText style={styles.title}>Adicionar Nova Comanda</ThemedText>
            <TextInput
              style={styles.input}
              placeholder="Nome do Cliente"
              value={novoCliente}
              onChangeText={setNovoCliente}
            />
            <TouchableOpacity
              style={styles.button}
              onPress={salvarNovaComanda}
            >
              <ThemedText type="default">Salvar Comanda</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalAdicionarVisible(false)}
            >
              <ThemedText>Cancelar</ThemedText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </ParallaxScrollView>
  );
};

const styles = StyleSheet.create({
  textStyle: {
    color: '#000',
    fontSize: 16,  
  },
  comandaItem: {
    padding: 20,
    marginVertical: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    color: 'black'
  },
  button: {
    backgroundColor: "#FF6347",
    padding: 10,
    marginTop: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  closeButton: {
    backgroundColor: "#FF6347",
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
    alignItems: "center",
  },
  addButton: {
    backgroundColor: "#32CD32",
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  modalContent: {
    backgroundColor: "#FFF",
    padding: 20,
    borderRadius: 10,
    width: "80%",
    alignItems: "center",
  },
  productItem: {
    padding: 10,
    marginVertical: 10,
    backgroundColor: "#e0e0e0",
    borderRadius: 10,
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 5,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderColor: "#ccc",
    borderWidth: 1,
    padding: 10,
    width: "100%",
    borderRadius: 5,
    marginBottom: 10,
  },
  headerImage: {
    marginTop: 50,
  },
  titleContainer: {
    marginVertical: 20,
    alignItems: "center",
  },
});

export default HomeScreen;
