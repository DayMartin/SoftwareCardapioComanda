import { Request, Response } from "express";
import {queryDatabase, runDatabase} from "../database/queryPromise";
import sqlite3 from "sqlite3";
import path from "path";
import { TotalResultComanda } from "../models/comanda.interface";
// Função para buscar todos os estoque

const dbPath = path.join(__dirname, "../database/database.sqlite");


const comandaController = {

	getComandas: async (req: Request, res: Response): Promise<void> => {
		const query = "SELECT * FROM comanda";
		let countQuery = "SELECT COUNT(*) AS total FROM comanda WHERE 1=1";
		const params: any[] = [];
	
		try {
		  const totalResult = await queryDatabase<TotalResultComanda>(countQuery, params);
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
		const { id } = req.params
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
		const { cliente, produtos } = req.body;
	
		if (!cliente || !Array.isArray(produtos) || produtos.length === 0) {
			res.status(400).json({ error: "cliente é obrigatório e produtos deve ser um array não vazio." });
			return;
		}
	
		const query = "INSERT INTO comanda (cliente, produtos) VALUES (?, ?)";
		const produtosString = JSON.stringify(produtos);
	
		const params = [cliente, produtosString];
	
		try {
			await queryDatabase(query, params);
			res.status(201).json({ message: "Comanda criada com sucesso." });
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao criar comanda." });
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
				res.status(404).json({ error: "Nenhuma comanda encontrada com o ID especificado." });
			} else {
				res.status(200).json({ message: "Comanda deletada com sucesso." });
			}
		} catch (error) {
			console.error(error);
			res.status(500).json({ error: "Erro ao deletar comanda." });
		}
	},
		
}

export { comandaController };