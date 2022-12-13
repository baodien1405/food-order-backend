import express from 'express'
import { PORT } from './config'
import dbConnection from './services/Database'
import App from './services/ExpressApp'
import * as dotenv from 'dotenv'
dotenv.config()

const StartServer = async () => {
  const app = express()

  await dbConnection()
  await App(app)

  app.listen(PORT, () => {
    console.log(`Listening to the port ${PORT}`)
  })
}

StartServer()
