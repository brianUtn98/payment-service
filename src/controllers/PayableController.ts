import { Request, Response } from "express";

import PayableDAO from '../daos/PayableDAO';
import DAO from '../daos/DAO'; 
import PayableDTO from './../dtos/PayableDTO';

class PayableController {
    private dao: DAO;

    constructor(dao: DAO){
        this.dao = dao;
    }

    public create(request: Request, response: Response): void{

        const { body } = request;

        this.dao.create(body).then((created) => {
            return response.status(201).end();
        }).catch((err) => {
            return response.status(400).json({reason: err});
        });
    }

    // * Not used
    public findAll(request: Request, response: Response): void{
        this.dao.findAll().then((result: Array<PayableDTO>) => {
            return response.status(200).json(result.map((payable) => {
                return {
                    serviceType: payable.serviceType,
                    dueDate: payable.dueDate,
                    amount: payable.amount,
                    barcode: payable.barcode,
                    status: payable.status
                }
            }))
        })
    }
    
    public find(request: Request, response: Response): void{
        const { query: { serviceType,status } } = request;

        console.log(request.query);

        if(!serviceType){
            this.dao.find(request.query).then((result: Array<PayableDTO>) => {
                return response.status(200).json({
                    count: result.length,
                    data: result.map((payable) => {
                        return {
                            serviceType: payable.serviceType,
                            dueDate: payable.dueDate,
                            amount: payable.amount,
                            barcode: payable.barcode,
                            status: payable.status
                        }
                    })
                })
            })
        } else {
            this.dao.find(request.query).then((result: Array<PayableDTO>) => {
                return response.status(200).json({
                    count: result.length,
                    data: result.map((payable) => {
                        return {
                            dueDate: payable.dueDate,
                            amount: payable.amount,
                            barcode: payable.barcode,
                            status: payable.status
                        }
                    })
                })
            })
        }
    }

    // ! Delete and update not implemented because is out of reach
}

// * dependency injection + singleton
export default new PayableController(PayableDAO);