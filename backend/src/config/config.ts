'use string'
import * as dotenv from 'dotenv'

dotenv.config()

interface IgoogleOauth {
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    GOOGLE_CLIENT_REDIRECT_URL: string
}

interface Ioauth {
    google: IgoogleOauth
}

interface Iconfig {
    oauth: Ioauth
}

const config: Iconfig = {
    oauth : {
        google : {
            GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
            GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
            GOOGLE_CLIENT_REDIRECT_URL: process.env.GOOGLE_CLIENT_REDIRECT || "http://localhost:3000/api/auth/google/callback"
        }
    }
}

export default config