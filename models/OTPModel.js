import { Schema, model } from 'mongoose'

const OTPSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: 60 * 5,
    }
})

const OTPModel = model('otp', OTPSchema)
OTPModel.createIndexes()

export default OTPModel