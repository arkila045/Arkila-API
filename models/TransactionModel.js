import { Schema, model } from 'mongoose'

const TransactionSchema = new Schema({
    rent: {
        type: Schema.Types.ObjectId,
        ref: 'rent',
        required: true,
    },
    paymentMethod: {
        type: String,
        enumes: ['gcash', 'cod']
    },
    type: {
        type: String,
        enumes: ['service_fee', 'item'],
        default: 'item',
        required: true
    }
}, { timestamps: true })

const TransactionModel = model('transaction', TransactionSchema)

export default TransactionModel