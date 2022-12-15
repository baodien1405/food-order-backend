import mongoose from 'mongoose'
import { MONGO_URI } from '../config'
mongoose.set('strictQuery', true)
// mongoose.set('strictPopulate', false)

export default async () => {
  try {
    await mongoose.connect(MONGO_URI)
    console.log('DB connected...')
  } catch (error) {
    console.log(error)
  }
}
