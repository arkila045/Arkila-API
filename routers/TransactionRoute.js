import { addTransaction } from "../controllers/TransactionController.js"

export const TransactionRoute = async (fastify) => {
    fastify.post('/', {
        preHandler: (request, repy, done) => {
            request.type = 'item'
            done()
        }
    }, addTransaction)
    fastify.post('/service-fee', {
        preHandler: (request, repy, done) => {
            request.type = 'service_fee'
            done()
        }
    }, addTransaction)
}