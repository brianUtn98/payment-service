import { Router, Request, Response } from "express";
import TransactionController from "../../controllers/TransactionController";

const transactionRouter = Router();

transactionRouter.post("/",(request: Request, response: Response) => TransactionController.create(request,response));

export default transactionRouter;