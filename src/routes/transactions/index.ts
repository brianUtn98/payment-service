import { Router, Request, Response } from "express";
import TransactionController from "../../controllers/TransactionController";

const transactionRouter = Router();

/**
 * TransactionBody
 * @typedef {object} TransactionBody
 * @property {string} paymentMethod.required - enum:cash,debit_card,credit_card
 * @property {string} cardNumber
 * @property {number} amount.required
 * @property {string} paymentDate.required
 * @property {string} barcode.required
 */


/**
 * POST /transactions
 * @summary Pay an unpaid tax
 * @tags Transactions
 * @param {TransactionBody} request.body.required
 * @return {object} 201 - created
 * @return {object} 400 - bad request
 * @return {object} 404 - not found
 * @return {object} 406 - not acceptable
 * @example response - 400 - bad request response
 * {
 *   "message": "No card number was given for a payment method who is not cash."
 * }
 * @example response - 404 - not found response
 * {
 *   "message": "That tax doesn't exist."
 * }
 * @example response - 406 - not acceptable response
 * {
 *   "message": "Tax payment is out of date."
 * }
 */
transactionRouter.post("/",(request: Request, response: Response) => TransactionController.create(request,response));

/**
 * TransactionReport
 * @typedef {object} TransactionReport
 * @property {string} paymentDate
 * @property {number} totalAmount
 * @property {number} transactionCount
 */

/**
 * TransactionReportResponse
 * @typedef {object} TransactionReportResponse
 * @property {number} count
 * @property {array<TransactionReport>} data
 */

/**
 * GET /transactions/report
 * @summary Gives a report of transactions between two dates
 * @tags Transactions
 * @return {TransactionReportResponse} 200 - success
 * @example response - 200 - success response
 * {
  "count": 2,
  "data": [
    {
      "paymentDate": "2022-05-03T03:00:00.000Z",
      "totalAmount": 6000,
      "transactionCount": 2
    },
    {
      "paymentDate": "2022-05-01T03:00:00.000Z",
      "totalAmount": 3680,
      "transactionCount": 2
    }
  ]
}
 */
transactionRouter.get("/report",(request: Request, response: Response) => TransactionController.report(request,response));


// * Ruta auxiliar para mostrar datos de prueba

transactionRouter.get("/",(request: Request, response: Response) => TransactionController.find(request,response));

export default transactionRouter;