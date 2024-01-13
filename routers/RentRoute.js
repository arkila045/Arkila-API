import { addRent, getRenterRent, getRentByStatus, setApproval, paymentReceived, itemReturnedOwner, getRequestByStatus, deleteRequest, getRent, updateStatus, getItemRents } from "../controllers/RentController.js"

const RentRoute = async (fastify) => {
    fastify.post('/', addRent)
    fastify.get('/:rentId', getRent)
    fastify.patch('/:rentId', updateStatus)
    fastify.get('/item/:itemId', getItemRents)
    //For owners
    fastify.get('/requests/:userId', {
        preHandler: (request, repy, done) => {
            request.status = 'pending'
            done()
        }
    }, getRentByStatus)
    fastify.patch('/requests/status/:rentId', setApproval)

    fastify.get('/awaiting-payment/:userId', {
        preHandler: (request, repy, done) => {
            request.status = 'receiving'
            done()
        }
    }, getRentByStatus)

    fastify.patch('/awaiting-payment/status/:rentId', paymentReceived)

    fastify.get('/rent-out/:userId', {
        preHandler: (request, repy, done) => {
            request.status = 'returning'
            done()
        }
    }, getRentByStatus)
    fastify.patch('/rent-out/status/:rentId', itemReturnedOwner)

    fastify.get('/unpaid-service/:userId', {
        preHandler: (request, repy, done) => {
            request.status = 'completing'
            request.statusCondition = 'unpaid'
            done()
        }
    }, getRentByStatus)


    fastify.get('/owner/completed/:userId', {
        preHandler: (request, repy, done) => {
            request.status = 'completing'
            request.statusCondition = 'completed'
            done()
        }
    }, getRentByStatus)


    //For Renters
    fastify.get('/pending/:userId', {
        preHandler: (request, repy, done) => {
            request.status = 'pending'
            done()
        }
    }, getRequestByStatus)
    fastify.delete('/pending/action/:rentId', deleteRequest)

    fastify.get('/to-pay/:userId', {
        preHandler: (request, repy, done) => {
            request.status = 'receiving'
            request.statusCondition = 'to pay'
            done()
        }
    }, getRequestByStatus)


    fastify.get('/to-pickup/:userId', {
        preHandler: (request, repy, done) => {
            request.status = 'receiving'
            request.statusCondition = 'to pick up'
            done()
        }
    }, getRequestByStatus)
    fastify.get('/:itemId/:renterId', getRenterRent)

    fastify.get('/renting/:userId', {
        preHandler: (request, repy, done) => {
            request.status = 'returning'
            done()
        }
    }, getRequestByStatus)

    fastify.get('/renter/completed/:userId', {
        preHandler: (request, repy, done) => {
            request.status = 'completing'
            done()
        }
    }, getRequestByStatus)
}

export default RentRoute