import { otpVerify, signin, signup } from "../controllers/AuthController.js"

const AuthRoute = async (fastify, option) => {
    fastify.post('/signin', signin)
    fastify.post('/signup', signup)
    fastify.post('/otp-verify', otpVerify)
}

export default AuthRoute