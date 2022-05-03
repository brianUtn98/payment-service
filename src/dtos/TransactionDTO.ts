
/**
 * Transaction
 * @typedef {object} TransactionDTO
 * @property {string} paymentMethod.required
 * @property {string} cardNumber
 * @property {number} amount.required
 * @property {string} paymentDate.required
 * @property {string} barcode.string
 */

export default interface TransactionDTO{
    paymentMethod: string;
    cardNumber: string;
    amount: number;
    paymentDate: Date;
    barcode: string;
    _id?: string;
}