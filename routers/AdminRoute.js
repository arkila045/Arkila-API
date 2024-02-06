import { getCounts } from "../controllers/AdminController.js"

export const AdminRoute = async (fastify) => {
    fastify.get('/count', getCounts)
}