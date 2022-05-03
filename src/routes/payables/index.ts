import { Router, Request, Response } from "express";
import PayableController from "../../controllers/PayableController";

const payableRouter = Router();

/**
 * PayableBody
 * @typedef {object} PayableBody
 * @property {string} serviceType.required
 * @property {string} description.required
 * @property {string} dueDate.required
 * @property {number} amount.required
 * @property {string} status.required - enum:paid,pending
 * @property {string} barcode.required  
 */

/**
 * POST /payables
 * @summary Create new tax for payments
 * @tags Payables
 * @param {PayableBody} request.body.required
 * @return {object} 201 - created
 * @return {object} 400 - bad request
 * @example response - 400 - bad request response
{
  "reason": {
    "errors": {
      "dueDate": {
        "name": "ValidatorError",
        "message": "Path `dueDate` is required.",
        "properties": {
          "message": "Path `dueDate` is required.",
          "type": "required",
          "path": "dueDate"
        },
        "kind": "required",
        "path": "dueDate"
      }
    },
    "_message": "Payable validation failed",
    "name": "ValidationError",
    "message": "Payable validation failed: dueDate: Path `dueDate` is required."
  }
}
 */
payableRouter.post("/",(request: Request, response: Response) => PayableController.create(request,response));

/**
 * PayableResponse
 * @typedef {object} PayableResponse
 * @property {number} count
 * @property {array<PayableDTO>} data
 */

/**
 * GET /payables
 * @summary List taxes
 * @tags Payables
 * @param {string} serviceType.query
 * @param {string} status.query
 * @return {PayableResponse} 200 - success
 * @example response - 200 - success response
{
  "count": 2,
  "data": [
    {
      "serviceType": "Electricidad",
      "dueDate": "2022-05-25T03:00:00.000Z",
      "amount": 3000,
      "barcode": "123456789224",
      "status": "paid"
    },
    {
      "serviceType": "Electricidad",
      "dueDate": "2022-05-25T03:00:00.000Z",
      "amount": 5500,
      "barcode": "523456789224",
      "status": "paid"
    }
    ]
}
 * @example response - 200 - success response
{
  "count": 1,
  "data": [
    {
      "dueDate": "2022-05-25T03:00:00.000Z",
      "amount": 3400,
      "barcode": "523452789224",
      "status": "pending"
    }
  ]
}
 */
payableRouter.get("/",(request: Request,response: Response) => PayableController.find(request,response));

export default payableRouter;