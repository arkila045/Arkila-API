import { Schema, model } from 'mongoose'

const ChatRoomSchema = new Schema({
    participants: [{
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }],
    lastMessage: {
        type: String
    }
}, { timestamps: true })


const ChatRoomModel = model('chatroom', ChatRoomSchema)
export default ChatRoomModel