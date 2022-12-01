import express from 'express'
import dbConnection from './services/Database'
import App from './services/ExpressApp'

const StartServer = async () => {
  const app = express()

  await dbConnection()
  await App(app)

  app.listen(8000, () => {
    console.log('Listening to the port 8000')
  })
}

StartServer()
