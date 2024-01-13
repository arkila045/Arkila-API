import { Schema, model } from 'mongoose'

const ItemSchema = new Schema({
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    pricePerDay: {
        type: Number,
        required: true
    },
    location: String,
    category: String,
    description: String,
    imageURL: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enums: ['available', 'not-available'],
        default: 'available',
    }
})

const ItemModel = model('item', ItemSchema)
export default ItemModel