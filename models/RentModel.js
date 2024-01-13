import { Schema, model } from "mongoose";

const RentSchema = new Schema({
    renter: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    item: {
        type: Schema.Types.ObjectId,
        ref: 'item',
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: {
        type: Date,
        required: true
    },
    status: {
        type: String,
        enums: ['pending', 'receiving', 'returning', 'completing', 'rejected'],
        default: 'pending'
    },
    isItemReceived: {
        type: Boolean,
        default: false,
        required: true
    },
    isPaymentReceived: {
        type: Boolean,
        default: false,
        required: true
    },
    isPaidServiceFee: {
        type: Boolean,
        default: false,
        required: true
    },
    isItemReturnedRenter: {
        type: Boolean,
        default: false,
        required: true
    },
    isItemReturnedOwner: {
        type: Boolean,
        default: false,
        required: true
    },
})

const RentModel = model('rent', RentSchema)
export default RentModel