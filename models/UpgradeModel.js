import { Schema, model } from 'mongoose'

const UpgradeSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    details: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true
    },
    status: {
        type: String,
        enums: ['pending', 'approved', 'rejected'],
        default: 'pending'
    }
}, { timestamps: true })

const UpgradeModel = model('upgrade', UpgradeSchema)

export default UpgradeModel