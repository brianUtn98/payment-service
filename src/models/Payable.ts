import mongoose from "mongoose";


const payableSchema = new mongoose.Schema({
    serviceType: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    dueDate: {
        type: Date,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    paymentDate: {
        type: Date
    },
    barcode: {
        type: String,
        required: true,
        unique: true
    },
    status: {
        type: String,
        required: true,
        enum: ["paid","pending"]
    }
});

const PayableModel = mongoose.model("Payable",payableSchema);

export default PayableModel;