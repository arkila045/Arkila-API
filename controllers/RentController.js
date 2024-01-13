import mongoose from "mongoose"
import RentModel from "../models/RentModel.js"

export const addRent = async (request, reply) => {
    try {
        const { renterId, itemId, startDate, endDate } = request.body
        await new RentModel({
            renter: renterId,
            item: itemId,
            startDate,
            endDate
        }).save()
        return reply.status(200).send({
            success: true,
            message: 'Rent request created.'
        })
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const getRent = async (request, reply) => {
    try {
        const { rentId } = request.params
        const rentDB = await RentModel
            .findOne({ _id: rentId })
            .populate({
                path: 'renter',
                select: '-sockets -password'
            })
            .populate({
                path: 'item',
            })

        return reply.status(200).send(rentDB)
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const getRenterRent = async (request, reply) => {
    try {
        const { itemId, renterId } = request.params
        const rentDB = await RentModel.findOne({ item: itemId, renter: renterId })
            .populate({ path: 'renter item', select: '-password -sockets' })
        return reply.status(200).send(rentDB)
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const getRentByStatus = async (request, reply) => {
    try {
        const { userId } = request.params
        const status = request.status || null
        const statusCondition = request.statusCondition || null

        const pipeline = [
            {
                $lookup: {
                    from: 'items',
                    localField: 'item',
                    foreignField: '_id',
                    as: 'item'
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'renter',
                    foreignField: '_id',
                    as: 'renter',
                    pipeline: [
                        {
                            $project: {
                                sockets: 0,
                                password: 0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: { path: '$item' }
            },
            {
                $unwind: { path: '$renter' }
            },
            {
                $match: { 'item.owner': new mongoose.Types.ObjectId(userId), status }
            }
        ]

        if (statusCondition === 'unpaid') {
            pipeline.push(
                {
                    $match: { isPaidServiceFee: false }
                },
                {
                    $lookup: {
                        from: 'transactions',
                        localField: '_id',
                        foreignField: 'rent',
                        as: 'transaction',
                        pipeline: [
                            {
                                $match: { 'type': 'item' }
                            },
                            {
                                $project: {
                                    paymentMethod: 1,
                                    type: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: { path: '$transaction' }
                },
                {
                    $match: { 'transaction.paymentMethod': 'cod' }
                }
            )
        }

        if (statusCondition === 'completed') {
            pipeline.push(
                {
                    $lookup: {
                        from: 'transactions',
                        localField: '_id',
                        foreignField: 'rent',
                        as: 'transaction',
                        pipeline: [
                            {
                                $match: { $or: [{ 'type': 'service_fee' }, { 'paymentMethod': 'gcash' }] }
                            },
                            {
                                $project: {
                                    paymentMethod: 1,
                                    type: 1
                                }
                            }
                        ]
                    }
                },
                {
                    $unwind: { path: '$transaction' }
                }
            )
        }

        const rentDB = await RentModel.aggregate(pipeline)
        return reply.status(200).send(rentDB)
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const getRequestByStatus = async (request, reply) => {
    try {
        const { userId } = request.params
        const status = request.status || null
        const statusCondition = request.statusCondition || null

        const pipeline = [
            {
                $match: { 'renter': new mongoose.Types.ObjectId(userId), status }
            },
            {
                $lookup: {
                    from: 'items',
                    localField: 'item',
                    foreignField: '_id',
                    as: 'item',
                    pipeline: [
                        {
                            $lookup: {
                                from: 'users',
                                localField: 'owner',
                                foreignField: '_id',
                                as: 'owner',
                                pipeline: [
                                    {
                                        $project: {
                                            sockets: 0,
                                            password: 0
                                        }
                                    }
                                ]
                            },
                        },
                        {
                            $unwind: { path: '$owner' }
                        }
                    ]
                }
            },
            {
                $lookup: {
                    from: 'users',
                    localField: 'renter',
                    foreignField: '_id',
                    as: 'renter',
                    pipeline: [
                        {
                            $project: {
                                sockets: 0,
                                password: 0
                            }
                        }
                    ]
                }
            },
            {
                $unwind: { path: '$item' }
            },
            {
                $unwind: { path: '$renter' }
            },
        ]

        if (statusCondition === 'unpaid') pipeline.push({
            $match: { isPaidServiceFee: false }
        })

        if (statusCondition === 'to pay') pipeline.push({
            $match: { isPaymentReceived: false }
        })

        if (statusCondition === 'to pick up') pipeline.push({
            $match: { isPaymentReceived: true }
        })

        const rentDB = await RentModel.aggregate(pipeline)
        return reply.status(200).send(rentDB)
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}



export const setApproval = async (request, reply) => {
    try {
        const { rentId } = request.params
        const { status } = request.body
        await RentModel.updateOne({ _id: rentId }, { status: status === 'accept' ? 'receiving' : 'rejected' })
        return reply.status(200).send({
            success: true,
            message: "Status updated."
        })
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const paymentReceived = async (request, reply) => {
    try {
        const { rentId } = request.params
        await RentModel.updateOne({ _id: rentId }, { isPaymentReceived: true })
        return reply.status(200).send({
            success: true,
            message: "Payment received."
        })
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const itemReturnedOwner = async (request, reply) => {
    try {
        const { rentId } = request.params
        await RentModel.updateOne({ _id: rentId }, { isItemReturnedOwner: true })
        return reply.status(200).send({
            success: true,
            message: "Item returned."
        })
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const deleteRequest = async (request, reply) => {
    try {
        const { rentId } = request.params
        await RentModel.deleteOne({ _id: rentId, status: 'pending' })
        return reply.status(200).send({
            success: true,
            message: "Request cancelled."
        })
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const updateStatus = async (request, reply) => {
    try {
        const { rentId } = request.params
        const updateBody = request.body
        await RentModel.updateOne({ _id: rentId }, { ...updateBody })
        return reply.status(200).send({
            success: true,
            message: "Status updated."
        })
    } catch (e) {
        console.log(e)
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const getItemRents = async (request, reply) => {
    try {
        const { itemId } = request.params
        const rentsDB = await RentModel.find({ item: itemId })
        return reply.status(200).send(rentsDB)
    } catch (e) {
        console.log(e)
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}