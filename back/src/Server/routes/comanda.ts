import { Router, Request, Response } from 'express';
import {comandaController} from "../controllers/comandaController";

const router = Router();

router.route("/comanda/all").get(comandaController.getComandas);
router.route("/comanda/create").post(comandaController.createComanda);
router.route("/comanda/id/:id").get(comandaController.getComanda);
router.route("/comanda/delete").delete(comandaController.deleteComanda);

export { router as comandaRouter };