import { Request, Response } from "express";
import PayableDAO from "../daos/PayableDAO";
import PayableDTO from "../dtos/PayableDTO";

import TransactionDAO from "../daos/TransactionDAO";
import DAO from "../daos/DAO";

class TransactionController {
  private dao: DAO;
  private payableDao: DAO;

  constructor(dao: DAO, payableDao: DAO) {
    this.dao = dao;
    this.payableDao = payableDao;
  }

  public async create(request: Request, response: Response): Promise<void> {
    const {
      body: { paymentMethod, cardNumber, amount, barcode, paymentDate },
    } = request;

    const payables: Array<PayableDTO> = await this.payableDao.find({ barcode });

    const payable: PayableDTO = payables[0];

    if (!payable) {
      response.status(404).json({ message: "That tax doesn't exist" });
      return;
    }

    if (payable.status === "paid") {
      response.status(406).json({ message: "That tax is already paid" });
      return;
    }

    try{ 
        const actualizado = await this.payableDao.updateById(payable._id, {
            serviceType: payable.serviceType,
            description: payable.description,
            dueDate: payable.dueDate,
            barcode: payable.barcode,
            status: "paid",
            paymentDate: new Date(),
          });

          this.dao.create({ paymentMethod, cardNumber, amount, barcode, paymentDate }).then((created) => {
              response.status(201).end();

              return;
          })
    }catch(err){
        response.status(400).json({reason: err});
    }
  }
}

export default new TransactionController(TransactionDAO,PayableDAO);