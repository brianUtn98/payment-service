import { Request, Response } from "express";
import PayableDAO from "../daos/PayableDAO";
import PayableDTO from "../dtos/PayableDTO";

import TransactionDAO from "../daos/TransactionDAO";
import DAO from "../daos/DAO";
import TransactionDTO from './../dtos/TransactionDTO';

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

    if(!cardNumber && paymentMethod !== "cash"){
      response.status(400).json({message: "No card number was given for a payment method who is not cash."});
      return;
    }

    const tran: TransactionDTO = { paymentMethod, cardNumber, amount, barcode, paymentDate };

    if(this.transactionTimedOut(tran,payable)){
      response.status(406).json({message: "Tax payment is out of date"});
      return;
    }

    if(this.invalidAmount(tran,payable)){
      response.status(406).json({message: "The payment amount is not equal to tax amount"});
      return;
    }

    try{ 
        const actualizado = await this.payableDao.updateById(payable._id!, {
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

  private transactionTimedOut(tran: TransactionDTO, payable: PayableDTO): boolean{
    return tran.paymentDate > payable.dueDate;
  }

  private invalidAmount(tran: TransactionDTO, payable: PayableDTO): boolean{
    return tran.amount !== payable.amount;
  }

  public  async find(request: Request, response: Response){
    const { query } = request;

    this.dao.find(query).then((result: Array<TransactionDTO>) => {
      response.status(200).json({
        count: result.length,
        data: result
      });
    })
  }

  public async report(request: Request, response: Response){
    const { query: { dateFrom, dateTo } } = request;

    if(!dateFrom || !dateTo){
      response.status(400).json({message: "This methods needs dateTo and dateFrom to create the report"});
      return;
    }

    const filter = { paymentDate: {
      $lte: dateTo,
      $gte: dateFrom
    }}

    this.dao.find(filter).then((result: Array<TransactionDTO>) => {
      const groupedBydate = this.groupByDate(result);

      const report = groupedBydate.map((item) => {
        return {
          paymentDate: item.date,
          totalAmount: item.transactions.map((tran) => tran.amount).reduce((a,b) => a+b,0),
          transactionCount: item.transactions.length
        }
      })

      response.status(200).json({
        count: report.length,
        data: report
      });
    })
  }

  private groupByDate(transactions: Array<TransactionDTO>){
    const dates = this.withoutRepetitions(transactions.map((tran) => tran.paymentDate));

    return dates.map((date) => {
      return {
        date: date,
        transactions: transactions.filter((tran) => tran.paymentDate.toDateString() === date.toDateString()).map((tran) => {
          return {
            amount: tran.amount,
            paymentMethod: tran.paymentMethod,
            cardNumber: tran.cardNumber,
            barcode: tran.barcode
          }
        })
      }
    });
  }

  private withoutRepetitions(list: Array<Date>): Array<Date>{
    return list.filter((item,index) => {
      return list.findIndex((elem) => elem.toDateString() === item.toDateString()) === index;
    })
  }
}

export default new TransactionController(TransactionDAO,PayableDAO);