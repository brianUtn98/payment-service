import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
     paymentMethod: {
         type: String,
         required: true
     },
     cardNumber: {
         type: String
     },
     amount: {
         type: Number,
         required: true
     },
     paymentDate: {
         type: Date,
         required: true
     },
     barcode: {
         type: String,
         required: true,
         unique: true
     }
})

const TransactionModel = mongoose.model("Transaction",transactionSchema);

export default TransactionModel;