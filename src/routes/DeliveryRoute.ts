import express from 'express'
import {
  DeliveryUserLogin,
  DeliveryUserSignUp,
  EditDeliveryUserProfile,
  GetDeliveryUserProfile,
  UpdateDeliveryUserStatus
} from '../controllers'
import { Authenticate } from '../middlewares'

const router = express.Router()

/** ---------------------- Signup / Create Customer ---------------------- **/
router.post('/signup', DeliveryUserSignUp)

/** ---------------------- Login ---------------------- **/
router.post('/login', DeliveryUserLogin)

// Authentication
router.use(Authenticate)

/** ---------------------- Change Service Status ---------------------- **/
router.put('/change-status', UpdateDeliveryUserStatus)

/** ---------------------- Profile ---------------------- **/
router.get('/profile', GetDeliveryUserProfile)

router.patch('/profile', EditDeliveryUserProfile)

export { router as DeliveryRoute }
