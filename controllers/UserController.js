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

export const getAllUsers = async (request, reply) => {
    try {
        const page = request.query.page || 1
        const limit = 10
        const skip = (page - 1) * limit
        const totalDocument = await UserModel.countDocuments()

        const usersDB = await UserModel
            .find()
            .sort('-_id')
            .limit(limit)
            .skip(skip)
            .select('-password')

        return reply.status(200).send({
            page: Number(page),
            hasNextPage: totalDocument > (skip + 10) ? true : false,
            data: usersDB
        })
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}
