import { editUser, getUser, getUsers } from "../controllers/UserController.js"

const UserRoute = async (fastify, option) => {
    fastify.get('/', getUsers)
    fastify.get('/:userId', getUser)
    fastify.patch('/:userId', editUser)
}

export default UserRoute