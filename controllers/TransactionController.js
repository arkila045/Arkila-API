import RentModel from '../models/RentModel.js'
import TransactionModel from '../models/TransactionModel.js'
export const addTransaction = async (request, reply) => {
    try {
        const transactionBody = request.body
        await new TransactionModel({ ...transactionBody }).save()

        if (request.type === 'item') {
            await RentModel.updateOne({ _id: transactionBody.rent }, { isPaymentReceived: true })
        }
        else if (request.type === 'service_fee') {
            await RentModel.updateOne({ _id: transactionBody.rent }, { isPaidServiceFee: true })
        }

        return reply.status(200).send({
            success: true,
            message: 'Transaction added.'
        })

    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}