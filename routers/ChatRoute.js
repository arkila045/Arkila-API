import { addConversation, getConversation, getUserConversationList } from "../controllers/ChatController.js"

const ChatRoute = async (fastify, option) => {
    fastify.get('/:userId', getUserConversationList)
    fastify.post('/:userId', addConversation)
    fastify.get('/conversation/:roomId', getConversation)
}

export default ChatRoute