import { Router } from "express";
import payableRouter from "./payables";
import transactionRouter from './transactions/index';

const router = Router();

router.use("/payables",payableRouter);
router.use("/transactions",transactionRouter);

export default router;