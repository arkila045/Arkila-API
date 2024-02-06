import bcrypt from 'bcrypt'
import { sendOTPcode } from '../utils/otp.js'
import UserModel from '../models/UserModel.js'
import OTPModel from '../models/OTPModel.js'
export const signin = async (request, reply) => {
    try {
        const { username, password } = await request.body

        const userDB = await UserModel.findOne({
            $or: [
                { email: username },
                { username: username }
            ],
            accountType: 'credential'
        }).select('password')

        if (!userDB?.password) throw new Error('Error')
        const isPasswordMatch = await bcrypt.compare(password, userDB.password)
        if (!isPasswordMatch) throw new Error('Password mismatch.')

        const userDetails = await UserModel.findOne({
            $or: [
                { email: username },
                { username: username }
            ],
            accountType: 'credential'
        }).select('-password')
        return reply.status(200).send(userDetails)
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const otpVerify = async (request, reply) => {
    try {
        const { otpCode, email } = await request.body
        const otpDB = await OTPModel.findOne({ email })
        if (!otpDB) throw new Error('OTP doesn\'t exist.')
        if (otpCode !== otpDB.otp) throw new Error('OTP mismatch.')
        const userDB = await UserModel.findOne({ email }).select('-password')
        return reply.status(200).send(userDB)
    } catch (e) {
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}

export const signup = async (request, reply) => {
    const genSaltRound = 10
    try {
        const {
            email,
            username,
            contactNo,
            password,
            accountType,
            firstName,
            lastName,
            address,
            barangay,
            city,
            qa_work,
            qa_role,
        } = await request.body
        await UserModel.create({
            email,
            username,
            name: {
                first: firstName,
                last: lastName,
                full: firstName + ' ' + lastName
            },
            address: {
                firstLine: address,
                barangay,
                city,
                full: address + ', ' + barangay + ', ' + city
            },
            contactNo,
            password: await bcrypt.hash(password, genSaltRound),
            role: 'user',
            accountType,
            qa_work,
            qa_role
        })

        sendOTPcode(email)

        return reply.status(200).send({
            success: true,
            message: 'User created.'
        })
    } catch (e) {
        console.log(e)
        return reply.status(400).send({
            success: false,
            message: e.message
        })
    }
}