import UpgradeModel from '../models/UpgradeModel.js'
import UserModel from '../models/UserModel.js'
export const addUpgrade = async (request, reply) => {
    try {
        const body = request.body
        await new UpgradeModel(body).save()
        return reply.status(200).send({
            success: true,
            message: 'Upgrade requested.'
        })
    } catch (error) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const updateUpgrade = async (request, reply) => {
    try {
        const { upgradeId } = request.params
        const { status, userId } = request.body
        await UpgradeModel.updateOne({ _id: upgradeId }, { status })
        if (status === 'approved') {
            await UserModel.updateOne({ _id: userId }, { $inc: { itemSlots: 3 } })
        }
        return reply.status(200).send({
            success: true,
            message: 'Upgrade updated.'
        })
    } catch (error) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const getUpgrades = async (request, reply) => {
    try {
        const page = request.query.page || 1
        const limit = 10
        const skip = (page - 1) * limit
        const totalDocument = await UpgradeModel.countDocuments()
        const upgradesDB = await UpgradeModel
            .find()
            .sort('-_id')
            .limit(limit)
            .skip(skip)
            .populate({ path: 'user', select: '-password' })

        return reply.status(200).send({
            page: Number(page),
            hasNextPage: totalDocument > (skip + 10) ? true : false,
            data: upgradesDB
        })
    } catch (error) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}