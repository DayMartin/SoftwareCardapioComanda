import { Router, Request, Response } from 'express';
import {estoqueController} from "../controllers/estoqueController";
import upload from '../../middleware/uploadConfig';

const router = Router();


router.route("/estoque/all").get(estoqueController.getEstoques);
router.route("/estoque/create").post(estoqueController.createEstoque);
router.route("/estoque/id").post(estoqueController.getEstoque);
router.route("/estoque/delete").delete(estoqueController.deleteEstoque);

export { router as estoqueRouter };
