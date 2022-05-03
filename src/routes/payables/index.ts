import { Router, Request, Response } from "express";
import PayableController from "../../controllers/PayableController";

const payableRouter = Router();

payableRouter.post("/",(request: Request, response: Response) => PayableController.create(request,response));

payableRouter.get("/",(request: Request,response: Response) => PayableController.find(request,response));

export default payableRouter;