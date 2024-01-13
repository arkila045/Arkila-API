import ChatRoomModel from "../models/ChatRoomModel.js"
import UserModel from "../models/UserModel.js"
import ChatMessageModel from "../models/ChatMessageModel.js"

const SocketIO = async (fastify, option) => {
    fastify.io.on('connection', socket => {
        socket.on('saveSocket', async (userId) => {
            try {
                socket.userId = userId
                const userDB = await UserModel.findOne({ _id: userId })
                const sockets = fastify.io.sockets.sockets
                userDB.sockets.push(socket.id)

                //remove not working sockets
                userDB.sockets = await userDB.sockets.filter((value, index) => sockets.has(value))
                userDB.save()
            } catch (e) {
                console.log(e.message)
            }
        })

        socket.on('sendMessage', async (message) => {
            try {
                const chatMessageDB = await (await new ChatMessageModel(message).populate({ path: 'sender', select: 'username' })).save()
                const chatRoomDB = await ChatRoomModel.findOne({ _id: message.chatRoomId }).populate({ path: 'participants', select: 'username sockets' })
                chatRoomDB.lastMessage = message.content
                chatRoomDB.updatedAt = Date.now()
                chatRoomDB.save()
                chatRoomDB.participants.map(participant => {
                    participant.sockets.map(socketId => {
                        if (socketId !== socket.id) {
                            fastify.io.to(socketId).emit('receiveMessage', chatMessageDB)
                        }
                        fastify.io.to(socketId).emit('updateChatRoom', chatRoomDB)
                    })
                })
            } catch (e) {
                console.log(e.message)
            }
        })

        socket.on('disconnect', async () => {
            try {
                const userDB = await UserModel.findOne({ _id: socket.userId })
                if (!userDB.sockets.includes(socket.id)) return
                userDB.sockets = userDB.sockets.filter((value) => value !== socket.id)
                userDB.save()
            } catch (e) {
                console.log(e.message)
            }
        })
    })
}

export default SocketIO