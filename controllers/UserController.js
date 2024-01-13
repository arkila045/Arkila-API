import UserModel from "../models/UserModel.js"
export const getUsers = async (request, reply) => {
    try {
        const search = request.query.search
        const usersDB = await UserModel.find({ username: { $regex: search, $options: 'i' } }).select('email username')
        return reply.status(200).send(usersDB)
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const getUser = async (request, reply) => {
    try {
        const { userId } = request.params
        const usersDB = await UserModel.findOne({ _id: userId }).select('-password -accountType -sockets')
        return reply.status(200).send(usersDB)
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const editUser = async (request, reply) => {
    try {
        const { userId } = request.params
        const updateBody = request.body
        await UserModel.updateOne({ _id: userId }, { ...updateBody })
        return reply.status(200).send({
            success: true,
            message: 'Profile updated.'
        })
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}
