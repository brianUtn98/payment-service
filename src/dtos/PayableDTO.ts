/**
 * Payable
 * @typedef {object} PayableDTO
 * @property {string} serviceType.required
 * @property {string} description.required
 * @property {string} dueDate.required
 * @property {number} amount.required
 * @property {string} paymentDate
 * @property {string} barcode.required
 */

export default interface PayableDTO{
    serviceType: string;
    description: string;
    dueDate: Date;
    amount: number;
    paymentDate: Date;
    barcode: string;
    status: string;
    _id: string;
}
