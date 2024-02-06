import { editUser, getAllUsers, getUser, getUsers } from "../controllers/UserController.js"

const UserRoute = async (fastify, option) => {
    fastify.get('/', getUsers)
    fastify.get('/:userId', getUser)
    fastify.get('/all', getAllUsers)
    fastify.patch('/:userId', editUser)
}

export default UserRoute