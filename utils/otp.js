import otpGenerator from 'otp-generator'
import OTPModel from '../models/OTPModel.js'
import OAuth2Client from '../utils/oAuth2.js'
import nodemailer from 'nodemailer'

const generateOTPcode = async (email) => {
    try {
        const otp = otpGenerator.generate(6, { lowerCaseAlphabets: false, specialChars: false })
        await new OTPModel({
            email,
            otp
        }).save()
        return otp
    } catch (e) {
        if (e.name === 'MongoServerError' && e.code) {
            throw new Error('There is existing OTP. Try again later.')
        }
        throw new Error(e.message)
    }
}

const sendEmail = async (email, otp) => {
    try {
        const { token } = await OAuth2Client.getAccessToken()
        const transport = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                type: "OAuth2",
                user: process.env.EMAIL,
                clientId: process.env.GOOGLE_CLIENT_ID,
                clientSecret: process.env.GOOGLE_CLIENT_SECRET,
                refreshToken: process.env.GOOGLE_REFRESH_TOKEN,
                accessToken: String(token)
            }
        })

        await transport.sendMail({
            from: `"Arkila" <${process.env.EMAIL}>`,
            to: email,
            subject: 'One-Time Password',
            html: `
            <h1>Your OTP: ${otp}</h1>
            `
        })

    } catch (e) {
        console.log(e)
        throw new Error(e)
    }
}

export const sendOTPcode = async (email) => {
    try {
        const OTPCode = await generateOTPcode(email)
        await sendEmail(email, OTPCode)
    } catch (e) {
        throw new Error(e)
    }

}