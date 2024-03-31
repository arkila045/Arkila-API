import 'dotenv/config'
import mongoose from 'mongoose';
import Fastify from "fastify";
import cors from '@fastify/cors'
import fastifySocketIO from 'fastify-socket.io';
import AuthRoute from './routers/AuthRoute.js';
import ChatRoute from './routers/ChatRoute.js';
import UserRoute from './routers/UserRoute.js';
import SocketIO from './plugins/socket-io.js';
import ItemRoute from './routers/ItemRoute.js';
import RentRoute from './routers/RentRoute.js';
import { TransactionRoute } from './routers/TransactionRoute.js';
import { UpgradeRoute } from './routers/UpgradeRoute.js';
import { AdminRoute } from './routers/AdminRoute.js';
const port = process.env.PORT || 5000;
const host = ("RENDER" in process.env) ? `0.0.0.0` : `localhost`;

const fastify = Fastify()

mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('DB connected'))
    .catch(err => console.log(err))

fastify.register(cors, {
    origin: ['http://localhost:3000', 'https://arkila-app.vercel.app', 'https://arkilacollects.com']
})

fastify.register(fastifySocketIO, {
    cors: {
        origin: ['http://localhost:3000', 'https://arkila-app.vercel.app', 'https://arkilacollects.com']
    }
})

fastify.get('/', async (request, reply) => {
    reply.send('Welcome to ARKILA API')
})
fastify.register(SocketIO)
fastify.register(AuthRoute, { prefix: '/api/v1/auth' })
fastify.register(UserRoute, { prefix: '/api/v1/user' })
fastify.register(ChatRoute, { prefix: '/api/v1/chat' })
fastify.register(ItemRoute, { prefix: '/api/v1/item' })
fastify.register(RentRoute, { prefix: '/api/v1/rent' })
fastify.register(TransactionRoute, { prefix: '/api/v1/transaction' })
fastify.register(UpgradeRoute, { prefix: '/api/v1/upgrade' })
fastify.register(AdminRoute, { prefix: '/api/v1/admin' })

try {
    setInterval(async () => {
        const res = await fetch('https://arkila-api.onrender.com')
        console.log(res.ok)
    }, 1000 * 60 * 3)
    await fastify.listen({ host, port }).then(() => console.log(`Listening to port ${process.env.PORT}`))
}
catch (err) {
    fastify.log.error(err)
    process.exit(1)
}
