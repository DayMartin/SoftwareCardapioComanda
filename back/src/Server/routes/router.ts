import { Router } from 'express';

import { comandaRouter } from "./comanda";
import { estoqueRouter } from './estoque';


const router = Router();


router.use("/", comandaRouter);
router.use("/", estoqueRouter);

export { router };
