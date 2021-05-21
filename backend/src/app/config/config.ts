'use string'
import * as dotenv from 'dotenv'

dotenv.config()

interface IgoogleOauth {
    GOOGLE_CLIENT_ID: string
    GOOGLE_CLIENT_SECRET: string
    test: string
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
            test: "test"
        }
    }
}

export default config