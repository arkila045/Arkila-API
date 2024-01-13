import ChatRoomModel from '../models/ChatRoomModel.js'
import UserModel from '../models/UserModel.js'
import ChatMessageModel from '../models/ChatMessageModel.js'
import mongoose from 'mongoose'
export const getUserConversationList = async (request, reply) => {
    try {
        const { userId } = request.params
        const roomsDB = await ChatRoomModel.find({ participants: { $in: userId } }).populate({ path: 'participants', select: 'username imageURL' }).sort('-updatedAt')
        return reply.status(200).send(roomsDB)
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const addConversation = async (request, reply) => {
    try {
        const { userId } = request.params
        const { userId: receiverId } = await request.body
        const chatRoomDB = await ChatRoomModel.findOne(
            {
                participants: {
                    $all: [
                        new mongoose.Types.ObjectId(userId),
                        new mongoose.Types.ObjectId(receiverId)
                    ]
                }
            }
        ).populate({ path: 'participants', select: 'username' })
        if (chatRoomDB) return reply.status(200).send(chatRoomDB)
        const saveChatRoomDB = await new ChatRoomModel({ participants: [userId, receiverId], lastMessage: null }).save()
        const usersDB = await UserModel.find({ _id: saveChatRoomDB.participants }).select('username imageURL')
        return reply.status(200).send({ ...saveChatRoomDB._doc, participants: usersDB })
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const getConversation = async (request, reply) => {
    try {
        const { roomId } = request.params
        const messagesDB = await ChatMessageModel.find({ chatRoomId: roomId }).populate({ path: 'sender', select: 'username imageURL' })
        return reply.status(200).send(messagesDB)
    } catch (e) {

        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}