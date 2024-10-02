import { Button, Text, View } from "react-native";

const ProductsScreen = () => {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text style={{ fontSize: 24, marginBottom: 20 }}>Bem-vindo ao Churrasquinhos!</Text>
      <Button
        title="Cadastrar Produtos +"
      />
    </View>
  );
};

export default ProductsScreen;
