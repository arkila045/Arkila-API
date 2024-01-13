import ItemModel from "../models/ItemModel.js"

export const addItem = async (request, reply) => {
    try {
        const itemBody = request.body
        await new ItemModel({ ...itemBody }).save()
        return reply.status(200).send({
            success: true,
            message: 'Item created.'
        })
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const getItems = async (request, reply) => {
    try {
        let query = {}
        const limit = request.query.limit
        const userId = request.query.userId
        const search = request.query.search
        const category = request.query.category
        const location = request.query.location

        if (userId) {
            query = { owner: userId }
        }

        if (location) {
            query = { ...query, location }
        }

        if (search) {
            query = { ...query, title: { $regex: search, $options: 'i' } }
        }

        if (category) {
            query = { ...query, category }
        }


        const itemsDB = await ItemModel
            .find(query)
            .limit(limit)
            .populate({ path: 'owner', select: '-password -sockets -accountType' })
        return reply.status(200).send(itemsDB)
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const editItem = async (request, reply) => {
    try {
        const { itemId } = request.params
        const updateBody = request.body
        await ItemModel.updateOne({ _id: itemId }, { ...updateBody })
        return reply.status(200).send({
            success: true,
            message: 'Item updated.'
        })
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}


export const getItem = async (request, reply) => {
    try {
        const { itemId } = request.params
        const itemDB = await ItemModel.findOne({ _id: itemId }).populate({ path: 'owner', select: '-password -sockets' })
        return reply.status(200).send(itemDB)
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}