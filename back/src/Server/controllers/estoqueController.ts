import { Request, Response } from "express";
import { queryDatabase,runDatabase } from "../database/queryPromise";
import path from "path";
import { TotalResult } from "../models/produto.interface";
// Função para buscar todos os estoque

const dbPath = path.join(__dirname, "../database/database.sqlite");

const estoqueController = {
  getEstoques: async (req: Request, res: Response): Promise<void> => {
    const query = "SELECT * FROM produtos";
    let countQuery = "SELECT COUNT(*) AS total FROM produtos WHERE 1=1";
    const params: any[] = [];

    try {
      const totalResult = await queryDatabase<TotalResult>(countQuery, params);
      const total = totalResult[0].total;
      const rows = await queryDatabase(query);

      if (rows.length === 0) {
        res.status(404).json({ error: "Nenhum produto cadastrado" });
      } else {
        res.status(200).json({ rows, total });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao buscar produtos" });
    }
  },

  getEstoque: async (req: Request, res: Response): Promise<void> => {
		const { id } = req.body
		const query = "SELECT * FROM produtos WHERE id = ?";
	
		try {
		  const rows = await queryDatabase(query, [id]);
	
		  if (rows.length === 0) {
			res.status(404).json({ error: "Nenhuma produtos cadastrada" });
		  } else {
			res.status(200).json({ rows });
		  }
		} catch (error) {
		  console.error(error);
		  res.status(500).json({ error: "Erro ao buscar produtos" });
		}
	  },

  createEstoque: async (req: Request, res: Response): Promise<void> => {
    const { nome, preco } = req.body;

    if (!nome || !preco) {
      res.status(400).json({ error: "Nome e preço são obrigatórios." });
      return; // Adicione um return aqui para sair da função
    }

    const query = "INSERT INTO produtos (nome, preco) VALUES (?, ?)";
    const params = [nome, preco];

    try {
      await queryDatabase(query, params);
      res.status(201).json({ message: "Produto criado com sucesso." });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao criar produto." });
    }
  },

  deleteEstoque: async (req: Request, res: Response): Promise<void> => {
    const { id } = req.body;

    if (!id) {
      res.status(400).json({ error: "O ID da estoque é obrigatório." });
      return;
    }

    const query = "DELETE FROM produtos WHERE id = ?";
    const params = [id];

    try {
      const result = await runDatabase(query, params);

      if (result.changes === 0) {
        res
          .status(404)
          .json({ error: "Nenhuma produtos encontrada com o ID especificado." });
      } else {
        res.status(200).json({ message: "produtos deletada com sucesso." });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Erro ao deletar produtos." });
    }
  },
};

export { estoqueController };
