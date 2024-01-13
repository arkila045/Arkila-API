import { Schema, model } from "mongoose";


const NameSchema = new Schema({
    first: {
        type: String,
        required: true,
        lowercase: true,
    },
    last: {
        type: String,
        required: true,
        lowercase: true,
    },
    full: {
        type: String,
        required: true,
        lowercase: true,
    }
}, { _id: false })

const AddressSchema = new Schema({
    firstLine: {
        type: String,
        required: true,
        lowercase: true,
    },
    barangay: {
        type: String,
        required: true,
        lowercase: true,
    },
    city: {
        type: String,
        required: true,
        lowercase: true,
    },
    full: {
        type: String,
        required: true,
        lowercase: true,
    }
}, { _id: false })


const UserSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    name: NameSchema,
    address: AddressSchema,
    imageURL: String,
    contactNo: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    role: {
        type: String,
        enum: ['user'],
        default: 'user',
        required: true
    },
    accountType: {
        type: String,
        enum: ['google', 'credential'],
        required: true,
        default: 'credential'
    },
    sockets: [{
        type: String
    }],
    itemSlots: {
        type: Number,
        default: 3
    }
})

const UserModel = model('User', UserSchema)
UserModel.createIndexes()
export default UserModel