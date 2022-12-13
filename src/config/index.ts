import * as dotenv from 'dotenv'
dotenv.config()

// export const MONGO_URI = 'mongodb://localhost:27017/online_food_delivery'
export const MONGO_URI = `mongodb+srv://${process.env.MONGO_USERNAME}:${process.env.MONGO_PASSWORD}@cluster0.1rzqqle.mongodb.net/?retryWrites=true&w=majority`
export const APP_SECRET = process.env.APP_SECRET
export const PORT = process.env.PORT || 8000
