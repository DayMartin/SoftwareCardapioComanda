import { Request, Response } from "express";
import { queryDatabase, runDatabase } from "../database/queryPromise";
import sqlite3 from "sqlite3";
import path from "path";
import { TotalResultComanda } from "../models/comanda.interface";
// Função para buscar todos os estoque

const dbPath = path.join(__dirname, "../database/database.sqlite");
interface ProdutoComanda {
	id: number;
    quantidade: number;
}

const comandaController = {
  getComandas: async (req: Request, res: Response): Promise<void> => {
    const query = "SELECT * FROM comanda";
    let countQuery = "SELECT COUNT(*) AS total FROM comanda WHERE 1=1";
    const params: any[] = [];

    try {
      const totalResult = await queryDatabase<TotalResultComanda>(
        countQuery,
        params
      );
      const total = totalResult[0].total;
      const rows = await queryDatabase(query);

      if (rows.length === 0) {
        res.status(404).json({ error: "Nenhuma comanda cadastrada" });
      } else {
        res.status(200).json({ rows, total });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar comanda" });
    }
  },

  getComanda: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const query = "SELECT * FROM comanda WHERE id = ?";

    try {
      const rows = await queryDatabase(query, [id]);

      if (rows.length === 0) {
        res.status(404).json({ error: "Nenhuma comanda cadastrada" });
      } else {
        res.status(200).json({ rows });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar comanda" });
    }
  },

  createComanda: async (req: Request, res: Response): Promise<void> => {
    const { cliente } = req.body;

    console.log('cliente', cliente)

    if (!cliente) {
      res.status(400).json({ error: "cliente é obrigatório" });
      return;
    }

    const query = "INSERT INTO comanda (cliente) VALUES (?)";
    const params = [cliente];

    try {
      await queryDatabase(query, params);
      res.status(201).json({ message: "Comanda criada com sucesso." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar comanda." });
    }
  },

  insertProduto: async (req: Request, res: Response): Promise<void> => {
    const { comanda, produto } = req.body;
    console.log('comanda', comanda, 'produto', produto)

    if (!comanda || !produto || !Array.isArray(produto)) {
        res.status(400).json({
            error: "Comanda e produtos são obrigatórios e produtos devem ser um array",
        });
        return;
    }

    try {
        for (const prod of produto) {
            if (!prod.id || typeof prod.quantidade !== 'number' || !prod.tipo) {
                res.status(400).json({ error: "Cada produto deve ter um ID, uma quantidade válida e um tipo" });
                return;
            }

            // Verifica se o produto já está na comanda
            const checkQuery = "SELECT quantidade FROM produto_comanda WHERE comanda = ? AND produto = ?";
            const checkParams = [comanda, prod.id];
            const existingProduct: ProdutoComanda[] = await queryDatabase(checkQuery, checkParams) as ProdutoComanda[];

            let newQuantity: number;

            if (existingProduct.length > 0) {
                // Produto já existe, soma ou substrai as quantidades
                if (prod.tipo === "Adicionar") {
                    newQuantity = existingProduct[0].quantidade + prod.quantidade;
                } else if (prod.tipo === "Excluir") {
                    newQuantity = existingProduct[0].quantidade - prod.quantidade;

                    // Se a nova quantidade for zero ou negativa, remove o produto
                    if (newQuantity <= 0) {
                        const deleteQuery = "DELETE FROM produto_comanda WHERE comanda = ? AND produto = ?";
                        const deleteParams = [comanda, prod.id];
                        await queryDatabase(deleteQuery, deleteParams);
                        continue; // Pula para o próximo produto
                    }
                } else {
                    res.status(400).json({ error: "Tipo inválido, deve ser 'Adicionar' ou 'Excluir'" });
                    return;
                }

                // Atualiza a quantidade se não for removido
                const updateQuery = "UPDATE produto_comanda SET quantidade = ? WHERE comanda = ? AND produto = ?";
                const updateParams = [newQuantity, comanda, prod.id];
                await queryDatabase(updateQuery, updateParams);
            } else {
                // Produto não existe, insere novo registro
                const insertQuery = "INSERT INTO produto_comanda (comanda, produto, quantidade) VALUES (?, ?, ?)";
                const insertParams = [comanda, prod.id, prod.quantidade];
                await queryDatabase(insertQuery, insertParams);
            }
        }

        res.status(201).json({ message: "Produtos adicionados ou atualizados na comanda com sucesso" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Erro ao adicionar produto à comanda" });
    }
},


  getComandaProdutos: async (req: Request, res: Response): Promise<void> => {
    const { comanda } = req.body;

    const query = "SELECT * FROM produto_comanda WHERE comanda = ?";
    let countQuery = "SELECT COUNT(*) AS total FROM produto_comanda WHERE 1=1";
    const params: any[] = [];

    try {
      const totalResult = await queryDatabase<TotalResultComanda>(
        countQuery,
        params
      );
      const total = totalResult[0].total;
      const rows = await queryDatabase(query, [comanda]);

      if (rows.length === 0) {
        res.status(404).json({ error: "Nenhuma comanda cadastrada" });
      } else {
        res.status(200).json({ rows, total });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar comanda" });
    }
  },

  deleteComandaProduto: async (req: Request, res: Response): Promise<void> => {
    const { comanda, produto } = req.body;

    if (!comanda || !produto || !Array.isArray(produto)) {
		res
		  .status(400)
		  .json({
			error:
			  "Comanda e produtos são obrigatórios e produtos devem ser um array",
		  });
		return;
	  }

	  const query = "DELETE FROM produto_comanda WHERE comanda = ? AND produto = ?";
	  const params = [comanda, produto];

    try {
      const result = await runDatabase(query, params);

      if (result.changes === 0) {
        res
          .status(404)
          .json({ error: "Nenhuma comanda encontrada com o ID especificado." });
      } else {
        res.status(200).json({ message: "Comanda deletada com sucesso." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar comanda." });
    }
  },

  deleteComanda: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ error: "O ID da comanda é obrigatório." });
      return;
    }

    const query = "DELETE FROM comanda WHERE id = ?";
    const params = [id];

    try {
      const result = await runDatabase(query, params);

      if (result.changes === 0) {
        res
          .status(404)
          .json({ error: "Nenhuma comanda encontrada com o ID especificado." });
      } else {
        res.status(200).json({ message: "Comanda deletada com sucesso." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar comanda." });
    }
  },
};

export { comandaController };
