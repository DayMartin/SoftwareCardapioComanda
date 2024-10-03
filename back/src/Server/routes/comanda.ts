import { Router, Request, Response } from 'express';
import {comandaController} from "../controllers/comandaController";

const router = Router();

router.route("/comanda/all").get(comandaController.getComandas);
router.route("/comanda/create").post(comandaController.createComanda);
router.route("/comanda/id/:id").get(comandaController.getComanda);
router.route("/comanda/delete").delete(comandaController.deleteComanda);

// produtos_comanda
router.route("/comanda/insertProduto").post(comandaController.insertProduto);
router.route("/comanda/consultProduto").post(comandaController.getComandaProdutos);
router.route("/comanda/deletarProduto").delete(comandaController.deleteComandaProduto);

export { router as comandaRouter };