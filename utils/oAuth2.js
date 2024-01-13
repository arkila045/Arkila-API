import { google } from 'googleapis'

const OAuth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET,
    process.env.GOOGLE_REDIRECT_URI
);

OAuth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN })

export default OAuth2Client
