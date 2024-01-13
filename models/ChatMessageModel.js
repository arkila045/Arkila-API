import { Schema, model } from 'mongoose'

const ChatMessageSchema = new Schema({
    chatRoomId: {
        type: Schema.Types.ObjectId,
        ref: 'chatroom',
        required: true
    },
    sender: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    content: {
        type: String,
        required: true
    }
})

const ChatMessageModel = model('message', ChatMessageSchema)
export default ChatMessageModel