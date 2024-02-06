import UpgradeModel from '../models/UpgradeModel.js'
import UserModel from '../models/UserModel.js'

export const getCounts = async (request, reply) => {
    try {
        const userCount = await UserModel.countDocuments()
        const requestCount = await UpgradeModel.countDocuments({ status: 'pending' })

        return reply.status(200).send({
            userCount,
            requestCount
        })
    } catch (error) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}