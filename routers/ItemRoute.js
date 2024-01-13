import { addItem, editItem, getItem, getItems } from "../controllers/ItemController.js"

const ItemRoute = async (fastify) => {
    fastify.get('/', getItems)
    fastify.post('/', addItem)
    fastify.put('/:itemId', editItem)
    fastify.get('/:itemId', getItem)
}

export default ItemRoute